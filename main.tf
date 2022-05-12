resource "aws_s3_bucket" "b" {
  bucket = "{SET_YOUR_OWN_UNIQUE_BUCKET_NAME_HERE}"
}

resource "aws_s3_bucket_acl" "{SET_YOUR_OWN_UNIQUE_BUCKET_NAME_HERE}" {
  bucket = aws_s3_bucket.b.id
  acl    = "private"
}