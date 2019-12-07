import fse from "fs-extra";
import { BaseProvider } from "./baseProvider";
import { IStorageProvider, IState } from "../../../types/storage";

export class FileProvider extends BaseProvider implements IStorageProvider {
  private dataFile: string;

  constructor(private path: string, private seed: any) {
    super();
    this.dataFile = `${this.path}/foxldb.json`;
  }

  init(): void {
    const isReady = fse.pathExistsSync(this.dataFile);

    if (isReady) {
      this.state = fse.readJsonSync(this.dataFile);
    } else {
      fse.removeSync(this.dataFile);
      fse.outputJsonSync(this.dataFile, this.seed);

      this.state = this.seed as IState;
    }

    this.seed = null;
  }

  save(): void {
    fse.outputJsonSync(this.dataFile, this.state);
  }
}
