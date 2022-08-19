export const LogExecutionTime = (): MethodDecorator => {
  return (_target: any, key: string, propertyDecorator: PropertyDescriptor) => {
    const fn = propertyDecorator.value;

    if (typeof fn === 'function') {
      propertyDecorator.value = async function (...args: any) {
        const start = new Date();
        console.info(`${key} started at ${start}`);
        try {
          return fn.apply(this, args);
        } catch (e) {
          console.error(`${key} execution got error`, { error: e });
          throw e;
        } finally {
          const end = new Date();
          console.info({
            message: `${key} finished at ${end}`,
          });
          console.info({
            message: `${key}'s execution duration ${
              end.getTime() - start.getTime()
            } ms`,
          });
        }
      };
    }
  };
};
