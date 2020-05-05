var resourcer_resource = function(type, name, params, credentials) {

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
};
