# S3 Resource R

[![Build Status](https://travis-ci.com/obiba/s3.resourcer.svg?branch=master)](https://travis-ci.com/obiba/s3.resourcer)
[![CRAN_Status_Badge](http://www.r-pkg.org/badges/version/s3.resourcer)](https://cran.r-project.org/package=s3.resourcer)

The `s3.resourcer` package is for accessing a file stored in the AWS S3 system or in a S3 compatible object store such as [minio](https://min.io/). It makes use of the [aws.s3](https://github.com/cloudyr/aws.s3) R package and of [sparklyr](https://spark.rstudio.com/) when the S3 file store is accessed through Apache Spark.

### S3 File Getter

The resource is a file which location is described by a URL with scheme `s3` (Amazon Web Services S3 file store) or `s3+http` or `s3+https` (Minio implementation of the S3 API over HTTP). To authenticate, the AWS/Minio key is the resource's identity and the AWS/Minio secret is the resource's secret.

For instance this is a valid resource object that can be accessed by the `S3FileResourceGetter`:

```
library(s3.resourcer)
res <- resourcer::newResource(url="s3://my_bucket/mtcars.Rdata", format = "data.frame")
client <- resourcer::newResourceClient(res)
client$asDataFrame()
```

or

```
library(s3.resourcer)
res <- resourcer::newResource(url="s3+https://minio.example.org/test/mtcars.Rdata", format = "data.frame")
client <- resourcer::newResourceClient(res)
client$asDataFrame()
```

### S3 Spark Connector

The resource is a [Parquet](https://parquet.apache.org/) file which location is described by a URL with scheme `s3+spark` (Amazon Web Services S3 file store) or `s3+spark+http` or `s3+spark+https` (Minio implementation of the S3 API over HTTP). The dataset will not be download as a file: instead of that Apache Spark will be used to access the resource, with the help of sparklyr. To authenticate, the AWS/Minio key is the resource's identity and the AWS/Minio secret is the resource's secret.


For instance this is a valid resource object that can be accessed by the `S3SparkDBIConnector`:

```
library(s3.resourcer)
res <- resourcer::newResource(url="s3+spark://my_bucket/mtcars")
client <- resourcer::newResourceClient(res)
client$asTbl()
```

or

```
library(s3.resourcer)
res <- resourcer::newResource(url="s3+spark+https://minio.example.org/test/mtcars")
client <- resourcer::newResourceClient(res)
client$asTbl()
```

or for a Parquet file inside a [Delta Lake](https://delta.io/), the query parameter `read` can be used 

```
library(s3.resourcer)
res <- resourcer::newResource(url="s3+spark+https://minio.example.org/test/mtcars?read=delta")
client <- resourcer::newResourceClient(res)
client$asTbl()
```
