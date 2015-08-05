// Generated by CoffeeScript 1.8.0
(function() {
  var ChildProcess, Meteor, chai, expect, isCoffee, path, ps, sinon, sinonChai, _;

  _ = require("underscore");

  chai = require("chai");

  expect = chai.expect;

  sinon = require("sinon");

  sinonChai = require("sinon-chai");

  chai.use(sinonChai);

  isCoffee = require('./isCoffee');

  if (isCoffee) {
    Meteor = require("../../src/Meteor");
    ChildProcess = require("../../src/ChildProcess");
  } else {
    Meteor = require("../../lib/Meteor");
    ChildProcess = require("../../lib/ChildProcess");
  }

  ps = require('psext');

  path = require("path");

  describe.only("Meteor", function() {
    var childProcessMockObj, defaultTestPort, env, expectedSpawnArgs, expectedSpawnOptions, getExpectedSpawnOptions, meteor, packageToTest, spawnStub;
    this.timeout(30000);
    meteor = null;
    spawnStub = null;
    defaultTestPort = 4096;
    env = null;
    packageToTest = 'success';
    expectedSpawnOptions = null;
    expectedSpawnArgs = null;
    childProcessMockObj = {
      on: function() {},
      stdout: {
        on: function() {}
      },
      stderr: {
        on: function() {}
      }
    };
    before(function() {
      delete process.env.PORT;
      delete process.env.ROOT_URL;
      return delete process.env.MONGO_URL;
    });
    beforeEach(function() {
      process.chdir(__dirname + "/../apps/leaderboard");
      env = _.clone(process.env);
      meteor = new Meteor();
      expectedSpawnArgs = ['test-packages', '--driver-package', 'test-in-console'];
      spawnStub = sinon.stub(ChildProcess.prototype, "spawn");
      return ChildProcess.prototype.child = childProcessMockObj;
    });
    afterEach(function() {
      ChildProcess.prototype.child = null;
      if (spawnStub != null) {
        if (typeof spawnStub.restore === "function") {
          spawnStub.restore();
        }
      }
      return spawnStub = null;
    });
    getExpectedSpawnOptions = function(port, rootUrl, mongoUrl, cwd) {
      if (cwd == null) {
        cwd = process.cwd();
      }
      expectedSpawnOptions = {
        cwd: cwd,
        detached: false,
        env: env
      };
      if (rootUrl == null) {
        rootUrl = "http://localhost:" + port + "/";
      }
      expectedSpawnOptions.env.ROOT_URL = rootUrl;
      if (mongoUrl != null) {
        expectedSpawnOptions.env.MONGO_URL = mongoUrl;
      }
      return expectedSpawnOptions;
    };
    it("testPackages() - should spawn meteor with no package arguments", function() {
      meteor.testPackages();
      expectedSpawnArgs.push("--port", defaultTestPort);
      return expect(spawnStub.args[0]).to.eql(["meteor", expectedSpawnArgs, getExpectedSpawnOptions(4096)]);
    });
    it("testPackages() - should spawn meteor with a package name argument", function() {
      meteor.testPackages({
        packages: [packageToTest]
      });
      expectedSpawnArgs.push("--port", defaultTestPort, packageToTest);
      return expect(spawnStub.args[0]).to.eql(["meteor", expectedSpawnArgs, getExpectedSpawnOptions(4096)]);
    });
    it("testPackages() - should spawn meteor with an absolute path to a --dir relative path", function() {
      meteor.testPackages({
        dir: '../todos'
      });
      expectedSpawnArgs.push("--port", defaultTestPort);
      return expect(spawnStub.args[0]).to.eql(["meteor", expectedSpawnArgs, getExpectedSpawnOptions(4096, null, null, path.resolve("../todos"))]);
    });
    it("testPackages() - should spawn meteor with an absolute path to a --dir absolute path", function() {
      meteor.testPackages({
        dir: path.resolve("../todos")
      });
      expectedSpawnArgs.push("--port", defaultTestPort);
      return expect(spawnStub.args[0]).to.eql(["meteor", expectedSpawnArgs, getExpectedSpawnOptions(4096, null, null, path.resolve("../todos"))]);
    });
    it("testPackages() - should spawn meteor with a ROOT_URL set to http://localhost:--port/", function() {
      var rootUrl;
      rootUrl = "http://localhost:5000/";
      meteor.testPackages({
        port: 5000
      });
      expectedSpawnArgs.push("--port", 5000);
      return expect(spawnStub.args[0]).to.eql(["meteor", expectedSpawnArgs, getExpectedSpawnOptions(5000, rootUrl)]);
    });
    it("testPackages() - should ignore env ROOT_URL", function() {
      process.env.ROOT_URL = "http://localhost:5000/";
      meteor.testPackages();
      expectedSpawnArgs.push("--port", defaultTestPort);
      return expect(spawnStub.args[0]).to.eql(["meteor", expectedSpawnArgs, getExpectedSpawnOptions(defaultTestPort)]);
    });
    it("testPackages() - should spawn meteor with a --settings argument", function() {
      meteor.testPackages({
        settings: "settings.json",
        packages: [packageToTest]
      });
      expectedSpawnArgs.push("--port", defaultTestPort, "--settings", "settings.json", packageToTest);
      return expect(spawnStub.args[0]).to.eql(["meteor", expectedSpawnArgs, getExpectedSpawnOptions(4096)]);
    });
    it("testPackages() - should spawn meteor with a --production argument", function() {
      meteor.testPackages({
        packages: [packageToTest],
        production: true
      });
      expectedSpawnArgs.push("--port", defaultTestPort, "--production", packageToTest);
      return expect(spawnStub.args[0]).to.eql(["meteor", expectedSpawnArgs, getExpectedSpawnOptions(4096)]);
    });
    it("testPackages() - should spawn meteor with a --release argument", function() {
      var releaseToTest;
      releaseToTest = '0.9.0';
      meteor.testPackages({
        release: releaseToTest,
        packages: [packageToTest]
      });
      expectedSpawnArgs.push("--release", releaseToTest, "--port", defaultTestPort, packageToTest);
      return expect(spawnStub.args[0]).to.eql(["meteor", expectedSpawnArgs, getExpectedSpawnOptions(4096)]);
    });
    it("testPackages() - should spawn meteor with ROOT_URL set to --root-url", function() {
      var rootUrl;
      rootUrl = "http://test.meteor.com/";
      meteor.testPackages({
        "root-url": rootUrl,
        packages: [packageToTest]
      });
      expectedSpawnArgs.push("--port", defaultTestPort, packageToTest);
      expect(spawnStub.args[0]).to.eql(["meteor", expectedSpawnArgs, getExpectedSpawnOptions(4096, rootUrl)]);
      return expect(spawnStub.args[0][2].env.ROOT_URL).to.equal(rootUrl);
    });
    it("testPackages() - should ignore env MONGO_URL", function() {
      process.env.MONGO_URL = "mongodb://localhost/mydb";
      meteor.testPackages();
      delete process.env.MONGO_URL;
      expectedSpawnArgs.push("--port", defaultTestPort);
      return expect(spawnStub.args[0]).to.eql(["meteor", expectedSpawnArgs, getExpectedSpawnOptions(4096)]);
    });
    it("testPackages() - should spawn meteor with MONGO_URL set to --mongo-url", function() {
      var mongoUrl;
      mongoUrl = "mongodb://localhost/mydb";
      meteor.testPackages({
        "mongo-url": mongoUrl,
        packages: [packageToTest]
      });
      expectedSpawnArgs.push("--port", defaultTestPort, packageToTest);
      expect(spawnStub.args[0]).to.eql(["meteor", expectedSpawnArgs, getExpectedSpawnOptions(4096, null, mongoUrl)]);
      return expect(spawnStub.args[0][2].env.MONGO_URL).to.equal(mongoUrl);
    });
    it("testPackages() - should spawn meteor with practicalmeteor:mocha driver package with --mocha option", function() {
      var mongoUrl;
      mongoUrl = "mongodb://localhost/mydb";
      env.SPACEJAM = "spacejam";
      expectedSpawnArgs = ['test-packages', '--driver-package', 'practicalmeteor:mocha'];
      expectedSpawnArgs.push("--port", defaultTestPort, packageToTest);
      meteor.testPackages({
        "mongo-url": mongoUrl,
        packages: [packageToTest],
        mocha: true
      });
      expect(spawnStub.args[0]).to.eql(["meteor", expectedSpawnArgs, getExpectedSpawnOptions(4096, null, mongoUrl)]);
      return expect(spawnStub.args[0][2].env.MONGO_URL).to.equal(mongoUrl);
    });
    return it("kill() - should kill internal mongodb child processes", function(done) {
      this.timeout(60000);
      spawnStub.restore();
      spawnStub = null;
      ChildProcess.prototype.child = null;
      meteor.testPackages({
        packages: [packageToTest]
      });
      return meteor.on("ready", (function(_this) {
        return function() {
          var e1, mongoPid, pid, timerId;
          try {
            pid = meteor.childProcess.child.pid;
            expect(meteor.mongodb.mongodChilds).to.have.length(1);
            mongoPid = meteor.mongodb.mongodChilds[0].pid;
            expect(mongoPid).to.be.ok;
            meteor.kill();
            return timerId = setInterval(function() {
              try {
                return process.kill(mongoPid, 0);
              } catch (_error) {
                clearInterval(timerId);
                return done();
              }
            }, 500);
          } catch (_error) {
            e1 = _error;
            return done(e1);
          }
        };
      })(this));
    });
  });

}).call(this);
