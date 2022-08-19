export const removeDuplicateObjectInArray = <T>(list: T[]) =>
  list.filter((item: T, index: number) => {
    const _item = JSON.stringify(item);
    return (
      index ===
      list.findIndex((obj) => {
        return JSON.stringify(obj) === _item;
      })
    );
  });
