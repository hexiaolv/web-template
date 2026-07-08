const fs = require('fs');

const content = fs.readFileSync('src/pages/analytics/reports/mockTemplates.ts', 'utf8');
const jsonStart = content.indexOf('[');
const jsonEnd = content.lastIndexOf(']') + 1;
const jsonStr = content.substring(jsonStart, jsonEnd);

let templates = JSON.parse(jsonStr);

// Helper to remove objects by type or specific id
const removeObject = (bands, typeList) => {
    bands.forEach(band => {
        band.objects = band.objects.filter(obj => !typeList.includes(obj.type));
    });
};

const moreProducts = [
    { name: '医用脱脂纱布块', spec: '10cm*10cm 8层', unit: '包', quantity: 1500, price: 3.5, amount: 5250 },
    { name: '一次性使用医用橡胶检查手套', spec: 'M号', unit: '盒', quantity: 800, price: 25.0, amount: 20000 },
    { name: '一次性使用真空采血管', spec: '5ml 促凝管', unit: '支', quantity: 3000, price: 0.8, amount: 2400 },
    { name: '医用外科口罩', spec: '非无菌型', unit: '只', quantity: 10000, price: 0.4, amount: 4000 },
    { name: '一次性使用无菌导尿管', spec: '16Fr 双腔', unit: '根', quantity: 500, price: 8.5, amount: 4250 },
    { name: '免洗手消毒凝胶', spec: '500ml/瓶', unit: '瓶', quantity: 200, price: 18.0, amount: 3600 }
];

templates.forEach(t => {
    // 1. More data
    t.mockData.products = t.mockData.products.concat(moreProducts);
    if (t.key === 'c_delivery_order') {
        t.mockData.sendQty = t.mockData.products.reduce((sum, p) => sum + p.quantity, 0);
        t.mockData.totalAmount = t.mockData.products.reduce((sum, p) => sum + p.amount, 0);
        t.mockData.creator = '刘建国';
        t.mockData.receiver = '王志强';
        t.mockData.remark = '请核对批号和效期，其中包含冷链物资需优先入库。';
        t.mockData.reviewer = '陈明';
        t.dataFields.push({ name: 'remark', label: '备注', type: 'string' });
        t.dataFields.push({ name: 'reviewer', label: '审核人', type: 'string' });
    } else if (t.key === 'c_finance_statement') {
        t.mockData.totalQuantity = t.mockData.products.reduce((sum, p) => sum + p.quantity, 0);
        t.mockData.totalAmount = t.mockData.products.reduce((sum, p) => sum + p.amount, 0);
        // hardcode totalChinese for simplicity, though actual would need conversion
        t.mockData.totalChinese = '伍万陆仟伍佰圆整';
        t.mockData.creator = '赵晓燕';
        t.mockData.reviewer = '林雪峰';
        t.mockData.receiver = '李伟';
        t.mockData.remark = '按月度结算协议，账期30天，请尽快安排付款。';
        t.dataFields.push({ name: 'remark', label: '备注', type: 'string' });
        t.dataFields.push({ name: 'receiver', label: '接收人', type: 'string' });
    }

    // 2. Remove images and barcodes from all bands
    // Specifically left bottom barcode, right top image
    t.fallbackBands.forEach(band => {
        band.objects = band.objects.filter(obj => {
            if (obj.type === 'barcode' || obj.type === 'qrcode' || obj.type === 'image') {
                return false;
            }
            return true;
        });
        
        // 3. Fix width for date/time (sendTime / period)
        band.objects.forEach(obj => {
            if (obj.fieldName === 'date' || obj.fieldName === 'sendTime' || obj.fieldName === 'period') {
                obj.width = 180;
                obj.fieldName = 'sendTime';
            }
            if (obj.type === 'current_date') {
                // If it's a date element that is generated, just make it wider
                obj.width = 180;
            }
            if (obj.text && obj.text.includes('打印时间')) {
                // make label slightly wider if needed
                obj.width = 75;
            }
            // For finance statement period that we replaced
            if (obj.text === '结算期间:') {
                obj.width = 75;
            }
        });
    });
});

const fileContent = `// 2 个单据的 Mock 数据字典、数据与默认布局配置文件\n\n` +
`export interface PrintTemplate {\n` +
`  key: string;\n` +
`  name: string;\n` +
`  code: string;\n` +
`  description: string;\n` +
`  dataFields: any[];\n` +
`  mockData: any;\n` +
`  fallbackBands: any[];\n` +
`  fallbackPageSettings: any;\n` +
`}\n\n` +
`export const mockTemplates: PrintTemplate[] = ${JSON.stringify(templates, null, 2)};\n`;

fs.writeFileSync('src/pages/analytics/reports/mockTemplates.ts', fileContent);
console.log('Update completed.');
