var aws_resourcer = {
  settings: {
    "title": "AWS S3 Resources",
    "description": "File resources that can be retrieved from an Amazon Web Services S3 file store.",
    "web": "https://github.com/obiba/aws.resourcer",
    "categories": [
      {
        "name": "s3",
        "title": "AWS S3",
        "description": "The resource is in an Amazon Web Services S3 file store."
      }
    ],
    "types": [
      {
        "name": "s3-rdata-file",
        "title": "R data file - AWS S3",
        "description": "File resource in R data format. The file will be downloaded from an Amazon Web Services S3 file store.",
        "tags": ["s3", "data-file", "rdata-format"],
        "parameters": {
          "$schema": "http://json-schema.org/schema#",
          "type": "array",
          "items": [
            {
              "key": "bucket",
              "type": "string",
              "title": "Bucket",
              "description": "The S3 bucket name."
            },
            {
              "key": "obj",
              "type": "string",
              "title": "Object key",
              "description": "The S3 object key."
            },
            {
              "key": "format",
              "type": "string",
              "title": "R object class",
              "description": "The primary class of the R object that is being loaded from the R data file. When there are several objects of this class, the one with the symbol with same name as the resource is chosen, otherwise the first one is selected."
            }
          ],
          "required": [
            "bucket", "object", "format"
          ]
        },
        "credentials": {
          "$schema": "http://json-schema.org/schema#",
          "type": "array",
          "description": "Credentials are optional. If not provided, it will default to AWS environment variables (if they exist).",
          "items": [
            {
              "key": "awskey",
              "type": "string",
              "title": "AWS key",
              "description": "The AWS Access Key ID. If missing, defaults to value stored in environment variable `AWS_ACCESS_KEY_ID`."
            },
            {
              "key": "awssecret",
              "type": "string",
              "title": "AWS secret",
              "format": "password",
              "description": "The AWS Secret Access Key. If missing, defaults to value stored in environment variable `AWS_SECRET_ACCESS_KEY`."
            }
          ]
        }
      },
      {
        "name": "s3-tidy-file",
        "title": "Tidy data file - AWS S3",
        "description": "File resource in tidy format, having a reader in the [tidyverse](https://www.tidyverse.org) ecosystem. The file will be downloaded from an Amazon Web Services S3 file store.",
        "tags": ["s3", "data-file", "tidy-format"],
        "parameters": {
          "$schema": "http://json-schema.org/schema#",
          "type": "array",
          "items": [
            {
              "key": "bucket",
              "type": "string",
              "title": "Bucket",
              "description": "The S3 bucket name."
            },
            {
              "key": "obj",
              "type": "string",
              "title": "Object key",
              "description": "The S3 object key."
            },
            {
              "key": "format",
              "type": "string",
              "title": "Format",
              "description": "Data format that can help when trying to coerce the file content to a data.frame.",
              "enum": [
                {
                  "key": "csv",
                  "title": "CSV (comma delimiter)"
                },
                {
                  "key": "csv2",
                  "title": "CSV2 (semicolon delimiter)"
                },
                {
                  "key": "ssv",
                  "title": "SSV (space delimiter)"
                },
                {
                  "key": "tsv",
                  "title": "TSV (tab delimiter)"
                },
                {
                  "key": "spss",
                  "title": "SPSS"
                },
                {
                  "key": "sav",
                  "title": "SAV"
                },
                {
                  "key": "por",
                  "title": "POR"
                },
                {
                  "key": "stata",
                  "title": "STATA"
                },
                {
                  "key": "dta",
                  "title": "DTA"
                },
                {
                  "key": "sas",
                  "title": "SAS"
                },
                {
                  "key": "xpt",
                  "title": "XPT"
                },
                {
                  "key": "excel",
                  "title": "EXCEL"
                },
                {
                  "key": "xls",
                  "title": "XLS"
                },
                {
                  "key": "xlsx",
                  "title": "XLSX"
                }
              ]
            }
          ],
          "required": [
            "bucket", "object", "format"
          ]
        },
        "credentials": {
          "$schema": "http://json-schema.org/schema#",
          "type": "array",
          "description": "Credentials are optional. If not provided, it will default to AWS environment variables (if they exist).",
          "items": [
            {
              "key": "awskey",
              "type": "string",
              "title": "AWS key",
              "description": "The AWS Access Key ID. If missing, defaults to value stored in environment variable `AWS_ACCESS_KEY_ID`."
            },
            {
              "key": "awssecret",
              "type": "string",
              "title": "AWS secret",
              "format": "password",
              "description": "The AWS Secret Access Key. If missing, defaults to value stored in environment variable `AWS_SECRET_ACCESS_KEY`."
            }
          ]
        }
      }
    ]
  },
  asResource: function(type, name, params, credentials) {

    //
    // Resource factory functions to be reused
    //
    var toS3Resource = function(name, params, credentials) {
        return {
            name: name,
            url: "aws://" + params.bucket + "/" + params.obj,
            format: params.format,
            identity: credentials.awskey,
            secret: credentials.awssecret
        };
    };

    var toRdataFormat = function(resource) {
      if (resource.format && !resource.url.toLowerCase().endsWith(".rda") && !resource.url.toLowerCase().endsWith(".rdata")) {
        resource.format = "R:" + resource.format;
      }
      return resource;
    }

    //
    // Resource factory functions by resource form type
    //
    var toResourceFactories = {
      "s3-rdata-file": function(name, params, credentials) {
          return toRdataFormat(toS3Resource(name, params, credentials));
      },
      "s3-tidy-file": toS3Resource
    };

    // Check if there is a resource factory function for the requested resource form type
    if (toResourceFactories[type]) {
        return toResourceFactories[type](name, params, credentials);
    }
    return undefined;
  }
}
