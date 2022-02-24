#' Apache Spark DBI resource connector for S3
#'
#' Makes a Apache Spark connection object, that is also a DBI connection object, from a S3 resource description.
#'
#' @docType class
#' @format A R6 object of class SparkResourceConnector
#' @import R6
#' @import httr
#' @import sparklyr
#' @export
S3SparkResourceConnector <- R6::R6Class(
  "S3SparkResourceConnector",
  inherit = SparkResourceConnector,
  public = list(
    
    #' @description Create a SparkResourceConnector instance.
    #' @return A SparkResourceConnector object.
    initialize = function() {},
    
    #' @description Check if the provided resource applies to a Apache Spark server.
    #'   The resource URL scheme must be one of "s3+spark", "s3+spark+http" or "s3+spark+https".
    #' @param resource The resource object to validate.
    #' @return A logical.
    isFor = function(resource) {
      "resource" %in% class(resource) && super$parseURL(resource)$scheme %in% c("s3+spark", "s3+spark+http", "s3+spark+https")
    },
    
    #' @description Creates a DBI connection object from a Apache Spark resource.
    #' @param resource A valid resource object.
    #' @return A DBI connection object.
    createDBIConnection = function(resource) {
      if (self$isFor(resource)) {
        super$loadDBI()
        private$loadSparklyr()
        url <- super$parseURL(resource)
        
        Sys.setenv("AWS_ACCESS_KEY_ID" = resource$identity,
                   "AWS_SECRET_ACCESS_KEY" = resource$secret)
        conf <- spark_config()
        
        conf$`spark.hadoop.fs.s3a.impl` <- "org.apache.hadoop.fs.s3a.S3AFileSystem"
        conf$`spark.hadoop.fs.s3a.aws.credentials.provider` <- "org.apache.hadoop.fs.s3a.SimpleAWSCredentialsProvider"
        
        if (identical(url$scheme, "s3+spark")) {
          # FIXME host = aws region ?
          conf$`spark.hadoop.fs.s3a.endpoint` <- url$host
          conn <- sparklyr::spark_connect(master = "local", config = conf)
        } else {
          protocol <- "http"
          if (identical(url$scheme, "s3+spark+https")) {
            protocol <- "https"
          }
          conf$`spark.hadoop.fs.s3a.endpoint` <- paste0(protocol, "://", url$host, ":", url$port)
          conn <- sparklyr::spark_connect(master = "local", config = conf)
        }
      } else {
        stop("Resource is not located in Apache Spark")
      }
    },
    
    #' @description Get the SQL table name from the resource URL.
    #' @param resource A valid resource object.
    #' @return The SQL table name.
    getTableName = function(resource) {
      url <- httr::parse_url(resource$url)
      if (is.null(url$path)) {
        stop("No database table name")
      } else {
        paste0("s3a://", url$path)
      }
    },
    
    #' @description Read a table as a vanilla tibble using DBI connection object.
    #' @param conn A DBI connection object.
    #' @param resource A valid resource object.
    readDBTable = function(conn, resource) {
      tibble::as_tibble(self$readDBTibble(conn, resource))
    },
    
    #' @description Read a table as a SQL tibble using DBI connection object.
    #' @param conn A DBI connection object.
    #' @param resource A valid resource object.
    readDBTibble = function(conn, resource) {
      table <- self$getTableName(resource)
      if (private$getReadParam(resource) == "delta") {
        sparklyr::spark_read_delta(conn, table)
      } else {
        sparklyr::spark_read_parquet(conn, table)
      }
    },
    
    #' @description Close the DBI connection to Apache Spark.
    #' @param conn A DBI connection object.
    closeDBIConnection = function(conn) {
      if ("spark_connection" %in% class(conn)) {
        sparklyr::spark_disconnect(conn)
      }
    }
    
  ),
  private = list(
    getReadParam = function(resource) {
      url <- httr::parse_url(resource$url)
      if (!is.null(url$query) && !is.null(url$query$read)) {
        url$query$read
      } else {
        "parquet"
      }
    },
    loadSparklyr = function() {
      if (!require("sparklyr")) {
        install.packages("sparklyr", repos = "https://cloud.r-project.org")
        library(sparklyr)
      }
      if (is.null(spark_home_dir())) {
        message("Installing Apache Spark")
        spark_install(version="3.2.1", hadoop_version = "2.7")
        spark_home_dir()
        # additional jars
        jars <- c("https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/2.7.4/hadoop-aws-2.7.4.jar",
                  "https://repo1.maven.org/maven2/org/apache/hadoop/hadoop-aws/2.7.4/hadoop-aws-2.7.4.jar",
                  "https://repo1.maven.org/maven2/com/amazonaws/aws-java-sdk/1.7.4/aws-java-sdk-1.7.4.jar")
        lapply(jars, function(jar) {
          httr::GET(jar, write_disk(file.path(spark_home_dir(), "jars", basename(jar)), overwrite = TRUE))
        })
      }
    }
  )
)