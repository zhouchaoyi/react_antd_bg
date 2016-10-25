import React, {PropTypes} from 'react'


class Container extends React.Component {

    render() {
        var folder = this.props.params.folder;
        var subfolder = this.props.params.subfolder;
        var name = this.props.params.name;
        //console.log(folder+"/"+subfolder+"/"+name+"<<<<<<路径");
        if(!name) {
            name = "index";
        }
        var Content = null;
        try {
            Content = require("../../views/"+folder+"/"+subfolder+"/"+name+".js");
        }catch(e) {
            console.log("<<<<<<<error404<<<<<<<<<<");
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
