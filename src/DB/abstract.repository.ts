import {
  Model,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

export abstract class AbstractRepo<T> {
  constructor(private _model: Model<T>) {}
  /***
   * @param data : T
   */
  public async create(data: Partial<T>) {
    const doc = new this._model(data); // ram
    return doc.save(); // deal with database
  }

  public async getOne(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions
  ) {
    return this._model.findOne(filter, projection, options);
  }

  public async getAll(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions
  ) {
    return this._model.find(filter, projection, options);
  }

  public async updateOne(
    filter: QueryFilter<T>,
    data: UpdateQuery<T>,
    options: QueryOptions = {}
  ) {
    options.returnDocument = "after";
    return this._model.findOneAndUpdate(filter, data, options);
  }

  public async deleteOne(filter: QueryFilter<T>) {
    return this._model.findOneAndDelete(filter);
  }
}
