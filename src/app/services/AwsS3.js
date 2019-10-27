import { s3Upload } from 'upload-files-to-aws';

class AwsS3 {
  index(file) {
    try {
      this.body = s3Upload(
        process.env.AWS_ACCESS_KEY,
        process.env.AWS_SECRET_ACESS_KEY,
        process.env.BUCKET_NAME,
        process.env.REGION,
        file
      );

      return 200;
    } catch (error) {
      this.body = { error: error.message };
      return 503;
    }
  }
}

export default new AwsS3();
