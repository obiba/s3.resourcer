test_that("AWS S3 resource builder works", {
  res <- newResource(
    name = "NA06985.final.csv",
    url = "s3://1000genomes/1000G_2504_high_coverage/data/ERR3239276/NA06985.final.csv",
    format = "csv"
  )
  expect_equal(res$name, "NA06985.final.csv")
  expect_equal(res$url, "s3://1000genomes/1000G_2504_high_coverage/data/ERR3239276/NA06985.final.csv")
  expect_null(res$identity)
  expect_null(res$secret)
  expect_equal(res$format, "csv")
  expect_equal(class(res), "resource")
  #client <- resourcer::newResourceClient(res)
  #expect_true("FileResourceClient" %in%  class(client))
  #expect_true("TidyFileResourceClient" %in%  class(client))
})

test_that("Minio resource builder works", {
  res <- newResource(
    name = "CNSIM3",
    url = "minio+http://localhost:9000/cnsim/CNSIM3.csv",
    identity = "minio",
    secret = "minio123",
    format = "csv"
  )
  expect_equal(res$name, "CNSIM3")
  expect_equal(res$url, "minio+http://localhost:9000/cnsim/CNSIM3.csv")
  expect_equal(res$identity, "minio")
  expect_equal(res$secret, "minio123")
  expect_equal(res$format, "csv")
  expect_equal(class(res), "resource")
  #client <- resourcer::newResourceClient(res)
  #expect_true("FileResourceClient" %in%  class(client))
  #expect_true("TidyFileResourceClient" %in%  class(client))
  #client$asDataFrame()
})
