angular.module("app").directive("imageTagger", function(){
  return {
    templateUrl: "/templates/image-tagger-template.html",
    scope: {},
    link: function($scope, $element, $attrs){
      var input = $element[0].querySelector(".tagger-autocomplete");

      //Setable attributes
      angular.extend($scope, {
        tags: !!$attrs.tags ? JSON.parse($attrs.tags) : [],
        url: $attrs.url || "",
        label: $attrs.label || "Tags",
        name: $attrs.testName || "tag_ids",
        idField: $attrs.idField || "id",
        displayField: $attrs.displayField || "name",
        listOnly: $attrs.listOnly !== void(0) && $attrs.listOnly !== "false" ? true : false,
        breakCharacter: $attrs.breakCharacter || " "
      });

      //unsettable attributes
      angular.extend($scope, {
        matches: [],
        userInput: "",
        selected_match: null,
        
      })

      angular.extend($scope, {
        createTag: function(){
          var reg = new RegExp($scope.breakCharacter, "g")
          var str = input.value.replace(reg, "")

          if (str.length > 0){
            $scope.tags.push(str);
            $scope.$apply();
          }

          input.value = "";
        },

        removeTag: function(){
          var word = $scope.tags.pop();
          $scope.$apply();
          input.value = word || "";
        },

        setInput: function(){

        }
      });

      $element[0].addEventListener("keyup", function(e){
        if (input.value.substring(input.value.length - 1) === $scope.breakCharacter){
          $scope.createTag();
        } 

        if (e.keyCode === 8 && input.value.length === 0){
          $scope.removeTag();
        }
      }, false)
    }
  }
})

/*
Autocomplete = {
    autocomplete: function(input, data, key, url, options){
      options = options || {};
      
      var self = this,
          userInput = "";
      
      var entities = {};

      var opts = {
        min: 3, //The minimum number of characters before autocomplete kicks in
        dropdownMax: 5, //The number of matches to display
        method: "GET", //The route method
        displayField: 'name', //The name of the returned field to display,
        valueField: 'id',
        selectOnly: true,
        additionalParams: null
      }

      for (var x in options){
        if (opts[x] !== void(0)) opts[x] = options[x];
      }
      
      input.autocomplete = "off";
      input.classList.add("autocomplete-display");

      var t = null;
      input.addEventListener('keyup', function(e){
        var current = input.parentNode.parentNode.querySelector(".autocomplete-selector");
        
        switch (e.keyCode){
          case 38:
            current.selectPrevious();
            break;
          case 40:
            current.selectNext();
            break;
          case 13:
            input.blur();
            break;
          case 8:
            userInput = input.value;
            removeCurrent();
            
            if (!opts.selectOnly) data[key] = input.value;
            
            break;
          default:
            userInput = input.value;

            var val = input.value,
                params = { search: val },
                additionalParams = !opts.additionalParams ? {} : opts.additionalParams(); 

            for (var x in additionalParams) params["filters[" + x + "]"] = additionalParams[x];

            if (val.length >= opts.min){
              if (t !== null) clearTimeout(t);
              t = setTimeout(function(){
                var xhr = document.createElement("core-xhr");
                var request_obj = xhr.request({
                  method: opts.method, 
                  url: url, 
                  params: params,
                  callback: function(resp){
                    var matches = JSON.parse(resp)

                    entities = {};
                    if (request_obj.getResponseHeader("Content-Type") === "application/vnd.siren+json"){
                      matches = parseSiren(matches);  
                    }
                    matchDisplay(input, matches);
                  }
                })
              }, 300);
            } else {
              if (!opts.selectOnly) data[key] = input.value;
            }
        }
      }, false)

      input.addEventListener("blur", function(){
        this.async(function(){
          removeCurrent();
          userInput = ""; 
        })
      }.bind(this));

      if (opts.displayField === opts.valueField && !opts.selectOnly){
        new PathObserver(data, key).open(function(){
          input.value = data[key] || ""
        })
      }

      var getField = function(n, d){
        var f = n.split(".");
        for (var i=0; i<f.length; i++){
          if (d[f[i]] !== void(0)) {
            d = d[f[i]]
          } else {
            return "";
          }
        }

        return d || "";
      }

      var matchDisplay = function(input, matches, coords){
        removeCurrent();
        
        if (!opts.selectOnly) data[key] = input.value
        if (matches.length === 0) return;

        var list = document.createElement("core-selector");
            list.className = "autocomplete-selector";
            list.valueattr = 'label'
            list.addEventListener("core-select", function(e){ if (e.detail.isSelected) selectItem.apply(null, arguments); }, false);
        
        for (var i=0; i<matches.length; i++){
          var entity_key = "_" + ((Math.random() * 1000000) | 0);
          entities[entity_key] = matches[i];

          if ( typeof (options.displayField ) === 'function' ){
            var display_fields = options.displayField(matches[i]);
          } else if ( Array.isArray(opts.displayField) ){ 
            //var display_fields = opts.displayField.map(function(field){ return matches[i][field] }).join(" ");
            var display_fields = [];
            for (var j=0; j<opts.displayField.length; j++){
              display_fields.push(getField(opts.displayField[j], matches[i]))
            }

            display_fields = display_fields.join(" ");
          } else {  
            var display_fields = matches[i][opts.displayField]
          }

          var item = document.createElement("div");
              item.appendChild( document.createTextNode(display_fields) );
              item.className = "autocomplete-list-item";
              item.label = display_fields;
              item.val = matches[i][opts.valueField],
              item.key = entity_key;

          list.appendChild(item);
          
          if (i === 0 && opts.selectOnly) list.selected = matches[i][opts.displayField];
        }

        input.parentNode.parentNode.appendChild(list);

        list.addEventListener("mousedown", function(e){
          list.selected = e.target.label
          selectItem(e);  
        }, false);
      };

      var selectItem = function(e){
        var target = e.target.tagName.toLowerCase() === 'core-selector' ? e.target : e.target.parentNode
            val = target.selected;

        if (!target.selectedItem) return;
        
        input.value = target.selectedItem.label;
        input.selectionStart = userInput.length;
        input.selectionEnd = val.length;
        
        data[key] = target.selectedItem.val;
        
        var entity = entities[target.selectedItem.key];
        Polymer.api.instance.utils.fire("autocomplete-select", { val: target.selectedItem.val, entity: entity }, input, true, true);
      }

      var removeCurrent = function(){
        var current = input.parentNode.parentNode.querySelector(".autocomplete-selector");
        if (current) input.parentNode.parentNode.removeChild(current);
      }

      var parseSiren = function(resp){
        var parsed = []
        for (var i=0; i<resp.entities.length; i++){
          var d = resp.entities[i].properties;
          for (var j=0; j<resp.entities[i].entities.length; j++){
            d[resp.entities[i].entities[j]["class"][0]] = resp.entities[i].entities[j].properties
          }

          parsed.push(d);
        }

        return parsed;
      }
    }
 */