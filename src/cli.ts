
import { forEachPackage } from './index';


export = async function cli(): Promise<void> {

  // @todo: parse CLI arguments

  await forEachPackage({
    // @todo: pass options from CLI arguments

    packageName: '@test/*',

  });

}
