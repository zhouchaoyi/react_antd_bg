import React, {PropTypes} from 'react'


class Container extends React.Component {

    render() {
        var folder = this.props.params.folder;
        var name = this.props.params.name;
        //console.log(folder+"/"+name+"<<<<<<路径");
        var Content = null;
        try {
            Content = require("../../views/"+folder+"/"+name+"/index.js");
        }catch(e) {
            console.log("error<<<<<<<404");
            //this.context.router.replace("/404"); //执行不了，弃用
        }
        
        return (
            <Content/>
        )
    }
}

Container.contextTypes = {
    router: PropTypes.object.isRequired
};


export default Container
