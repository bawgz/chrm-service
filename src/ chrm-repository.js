import mongodb from 'mongodb';

export default class ChrmRepository {
  constructor() {
    this.MONGODB_URI = process.env.MONGODB_URI;
  }

  async fetchChrms() {
    const db = await mongodb.MongoClient.connect(this.MONGODB_URI);
    const collection = db.db('chrmr').collection('chrms');
    return collection.find({}).toArray();
  }
}
