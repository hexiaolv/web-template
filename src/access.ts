/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(
  initialState:
    | { currentUser?: API.CurrentUser; currentDomain?: string }
    | undefined,
) {
  const { currentUser, currentDomain } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.access === 'admin',
    isMedicineDomain: currentDomain === 'medicine',
    isConsumableDomain: currentDomain === 'consumable',
  };
}
