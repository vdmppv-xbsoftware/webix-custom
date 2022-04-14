const MOVIE_LIST_ID = "movie_list";
const FORM_VIEW_ID = "form_id";
const STATE_BUTTON_ID = "statebutton_id";

function sortList(state){
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
          id: STATE_BUTTON_ID,
          view: "statesButton",
          gravity: 1.5,
          states: {0: "Off", 1: "Sort Asc", 2: "Sort Desc"}, 
          state: 2,
          on: {
	          onStateChange(state){
              sortList(state);
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
      template: "<strong>#id#. #title# </strong> <br/> Year: #year#, rank: #rank#",
      ready(){
        const current = $$(STATE_BUTTON_ID).config.state;
        sortList(current);
      }
    }
  ]
}

const inputForm = {
  id: FORM_VIEW_ID,
  view: "generatedForm",
  fields: ["Fname", "Lname", "Address"],
  saveAction() {
    const formValues = $$(FORM_VIEW_ID).getValues();

    Object.entries(formValues).forEach(([key, value]) => {
      webix.message(`${key}: ${value}`)
    })
  },
  cancelAction(){
    $$(FORM_VIEW_ID).clear();
    webix.message("custom cancelAction");
  }
}

webix.protoUI({
  name: "statesButton",
  $init(config) {
    const styles = ["off", "sort-asc", "sort-desc"];

    if (!config || !config.states) {
      webix.message("States are missing");
      return;
    } 

    config.label = config.states[config.state];
    webix.html.addCss(this.$view, styles[config.state]);

    this.attachEvent("onItemClick", () => {
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
  name: "generatedForm",
  defaults: {
    saveAction(){
      webix.message("default saveAction")
    },
    cancelAction(){
      webix.message("default cancelAction");
    }
  },
  $init(config) {
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