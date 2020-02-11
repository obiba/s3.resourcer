# AWS Resource R

[![Build Status](https://travis-ci.com/obiba/aws.resourcer.svg?branch=master)](https://travis-ci.com/obiba/aws.resourcer)
[![CRAN_Status_Badge](http://www.r-pkg.org/badges/version/aws.resourcer)](https://cran.r-project.org/package=aws.resourcer)

The `aws.resourcer` package is for accessing a file stored in the AWS S3 system. It makes use of the [aws.s3](https://github.com/cloudyr/aws.s3) R package.

### S3 File Getter

The resource is a file which location is described by a URL with scheme `s3` or `aws` (Amazon Web Services S3 file store). To authenticate, the AWS key is the resource's identity and the AWS secret is the resource's secret.

For instance this is a valid resource object that can be accessed by the `S3FileResourceGetter`:

```
library(aws.resourcer)
res <- resourcer::newResource(url="aws://my_bucket/mtcars.Rdata", format = "data.frame")
client <- resourcer::newResourceClient(res)
client$asDataFrame()
```