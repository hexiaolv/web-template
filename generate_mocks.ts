import fs from 'fs';
import Module from 'module';
import path from 'path';

// Mock @umijs/max before requiring files
const originalRequire = Module.prototype.require;
Module.prototype.require = function (id: string) {
  if (id === '@umijs/max') {
    return {
      defineMock: (obj: any) => obj,
    };
  }
  return originalRequire.apply(this, [id]);
};

const mockDir = path.join(__dirname, 'public/mock_api');

function findMockFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (
        file !== 'node_modules' &&
        file !== '.git' &&
        file !== '.umi' &&
        file !== '.umi-production'
      ) {
        findMockFiles(filePath, fileList);
      }
    } else if (file.endsWith('_mock.ts') || file.endsWith('_mock.js')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

async function main() {
  const files = findMockFiles(path.join(__dirname, 'src'));
  console.log(`Found ${files.length} mock files.`);

  for (const file of files) {
    console.log(`Processing mock file: ${file}`);
    try {
      // Clear cache to ensure clean load
      delete require.cache[require.resolve(file)];
      const mockModule = require(file);
      const mockObj = mockModule.default || mockModule;

      for (const [key, value] of Object.entries(mockObj)) {
        const methodMatch = key.match(/^(GET|POST|PUT|DELETE)\s+(.*)$/);
        if (methodMatch) {
          const method = methodMatch[1];
          const apiPath = methodMatch[2].trim();
          if (!apiPath.startsWith('/api/')) continue;

          const relativePath = apiPath.substring(5); // remove '/api/'
          const targetJsonPath = path.join(mockDir, `${relativePath}.json`);

          // 如果已经有 GET 请求生成的 JSON，不要用 POST 等其他请求的简单 json (比如 {success:true}) 覆盖它
          if (method !== 'GET' && fs.existsSync(targetJsonPath)) {
            continue;
          }

          let responseData: any = null;

          if (typeof value === 'function') {
            const req = {
              query: {},
              params: {},
              body: {},
            };
            const res = {
              json: (data: any) => {
                responseData = data;
              },
              send: (data: any) => {
                responseData = data;
              },
            };
            try {
              (value as Function)(req, res);
            } catch (e) {
              console.error(
                `Error executing handler for ${key} in ${file}:`,
                e,
              );
            }
          } else {
            responseData = value;
          }

          if (responseData) {
            fs.mkdirSync(path.dirname(targetJsonPath), { recursive: true });
            fs.writeFileSync(
              targetJsonPath,
              JSON.stringify(responseData, null, 2),
              'utf-8',
            );
            console.log(`  -> Written to ${targetJsonPath}`);
          }
        }
      }
    } catch (e) {
      console.error(`Failed to require/process mock file ${file}:`, e);
    }
  }
  console.log('Static mock generation complete!');
}

main().catch(console.error);
