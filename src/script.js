const MOVIE_LIST_ID = "movie_list";
const BUTTON_VIEW_ID = "custom_button";
const FORM_VIEW_ID = "custom_form";

const movieList = {
  rows: [
    {
      view: "toolbar",
      paddingX: 10,
      cols: [
        {
          view: "label",
          label: "Sort list:",
        },
        {
          view: BUTTON_VIEW_ID,
          width: 100,
          states: {0: "Off", 1: "Sort Asc", 2: "Sort Desc"}, 
          state: 0,
          on: {
	          onStateChange(state){
              const list = $$(MOVIE_LIST_ID);
              switch (state) {
                case 0:
                  list.sort("id", "asc", "int");
                  break;
                case 1:
                  list.sort("title", "asc");
                  break;
                case 2: 
                  list.sort("title", "desc");
                  break; 
              }
            }
          }
        },
        { }
      ]
    },
    {
      view: "list",
      id: MOVIE_LIST_ID,
      scroll: false,
      url: "data/data.js",
      type: {
        height: 60
      },
      template: "<strong>#id#. #title# </strong> <br/> Year: #year#, rank: #rank#"
    }
  ]
}

const inputForm = {
  view: FORM_VIEW_ID,
  id: FORM_VIEW_ID,
  fields: ["Fname", "Lname", "Address"],
  saveAction() {
    const formValues = $$(FORM_VIEW_ID).getValues();
    Object.keys(formValues).forEach(key => {
      webix.message(`${key}: ${formValues[key]}`)
    })
  },
  cancelAction(){
    $$(FORM_VIEW_ID).clear();
    webix.message("custom cancelAction");
  }
}

webix.protoUI({
  name: BUTTON_VIEW_ID,
  defaults: {
    css: "off",
    label: "Off"
  },
  $init(config) {
    const styles = ["off", "sort-asc", "sort-desc"];

    this.attachEvent("onItemClick", () => {;
      let currentState = this.config.state;
      
      webix.html.removeCss(this.$view, styles[currentState])

      currentState++;
      if (currentState > 2) currentState = 0;
      
      webix.html.addCss(this.$view, styles[currentState])
  
      this.config.state = currentState;
      this.config.label = this.config.states[currentState];

      this.refresh();
      this.callEvent("onStateChange", [currentState]);
    })
  }
}, webix.ui.button)

webix.protoUI({
  name: FORM_VIEW_ID,
  id: FORM_VIEW_ID,
  defaults: {
    saveAction(){
      webix.message("default saveAction")
    },
    cancelAction(){
      $$(FORM_VIEW_ID).clear();
      webix.message("default cancelAction");
    }
  },
  $init: function (config) {
    const fields = config.fields.map((item) => {
      return { 
        view: "text", 
        label: item, 
        name: item 
      };
    });
    
    const buttons = {
      cols: [
        {
          view: "button",
          value: "Cancel",
          click: config.cancelAction ? config.cancelAction : this.defaults.cancelAction
        },
        { },
        {
          view: "button",
          value: "Save",
          css: "webix_primary",
          click: config.saveAction ? config.saveAction : this.defaults.saveAction 
        },
      ],
    };

    config.elements = [...fields, buttons];
  }
}, webix.ui.form)

webix.ready(function(){
  webix.ui({
    cols: [
      movieList,
      { view: "resizer" },
      inputForm
    ]
  });
});