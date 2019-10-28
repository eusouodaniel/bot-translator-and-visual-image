import AWS from 'aws-sdk';
import uuidv4 from 'uuid/v4';

class AwsS3 {
  async uploadToS3(data) {
    const name = uuidv4();
    try {
      const s3 = await this.connectToS3();

      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `audios/${name}.wav`,
        Body: data,
        ContentType: 'audio/x-wav',
        ACL: 'public-read',
      };
      const result = await s3
        .upload(params, async function(err, body) {
          if (body) {
            return body.Location;
          }
        })
        .promise();

      return result.Location;
    } catch (error) {
      return 503;
    }
  }

  async connectToS3() {
    const s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      Bucket: process.env.AWS_S3_BUCKET_NAME,
    });

    return s3bucket;
  }
}

export default new AwsS3();
