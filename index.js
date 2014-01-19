// Generated by CoffeeScript 1.6.3
(function() {
  var DropPlugin, ever;

  ever = require('ever');

  require('string.prototype.endswith');

  module.exports = function(game, opts) {
    return new DropPlugin(game, opts);
  };

  DropPlugin = (function() {
    function DropPlugin(game, opts) {
      this.game = game;
      if (this.game.materials.artPacks == null) {
        throw new Error('voxel-drop requires voxel-texture-shader with artPacks');
      }
      this.packs = this.game.materials.artPacks;
      this.body = ever(document.body);
      this.enable();
    }

    DropPlugin.prototype.enable = function() {
      var _this = this;
      this.body.on('dragover', this.dragover = function(ev) {
        ev.stopPropagation();
        return ev.preventDefault();
      });
      return this.body.on('drop', this.drop = function(mouseEvent) {
        var file, files, shouldAppend, _i, _len, _results;
        mouseEvent.stopPropagation();
        mouseEvent.preventDefault();
        console.log('drop', mouseEvent);
        files = mouseEvent.target.files || mouseEvent.dataTransfer.files;
        console.log('Dropped', files);
        _results = [];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          console.log('Reading dropped', file);
          if (file.name.endsWith('.zip')) {
            shouldAppend = mouseEvent.shiftKey;
            _results.push(_this.loadArtPack(file, shouldAppend));
          } else if (file.name.endsWith('.js')) {
            _results.push(_this.loadScript(file));
          } else {
            _results.push(window.alert("Unrecognized file dropped: " + file.name + ". Try dropping a resourcepack/artpack (.zip)"));
          }
        }
        return _results;
      });
    };

    DropPlugin.prototype.readAllFile = function(file, asText, cb) {
      var reader,
        _this = this;
      reader = new FileReader();
      ever(reader).on('load', function(readEvent) {
        var result;
        if (readEvent.total !== readEvent.loaded) {
          return;
        }
        result = readEvent.currentTarget.result;
        return cb(result);
      });
      if (asText) {
        return reader.readAsText(file);
      } else {
        return reader.readAsArrayBuffer(file);
      }
    };

    DropPlugin.prototype.readAllText = function(file, cb) {
      return this.readAllFile(file, true, cb);
    };

    DropPlugin.prototype.readAllData = function(file, cb) {
      return this.readAllFile(file, false, cb);
    };

    DropPlugin.prototype.loadScript = function(file) {
      var _this = this;
      return this.readAllText(file, function(text) {
        return eval(text);
      });
    };

    DropPlugin.prototype.loadArtPack = function(file, shouldAppend) {
      var _this = this;
      return this.readAllData(file, function(arrayBuffer) {
        if (!shouldAppend) {
          _this.packs.clear();
        }
        _this.packs.addPack(arrayBuffer, file.name);
        return _this.game.showAllChunks();
      });
    };

    DropPlugin.prototype.disable = function() {
      this.body.removeListener('dragover', this.dragover);
      return this.body.removeListener('drop', this.drop);
    };

    return DropPlugin;

  })();

}).call(this);
