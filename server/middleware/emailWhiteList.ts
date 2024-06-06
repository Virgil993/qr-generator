export function EmailWhiteList(whiteList: string[] = []) {
  return function (value: Function, _context: any) {
    return async function (...args: any[]) {
      if (args.length === 0 || !args[0].isGnzContext) {
        console.log(
          "Warning: the emailWhiteList decorator must be used with the first parameter being a GnzContext object"
        );
        throw new Error("Invalid context");
      }
      if (!args[0].user?.email) {
        throw new Error("User not authentificated or token has expired");
      }
      if (!whiteList.includes(args[0].user?.email)) {
        throw new Error("User not in white list");
      }

      // @ts-expect-error
      const func = value.bind(this);
      const result = func(...args);
      return result;
    };
  };
}
