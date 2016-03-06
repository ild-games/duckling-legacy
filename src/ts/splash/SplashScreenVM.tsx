var gui = _require("nw.gui");

import * as React from "react";
import * as ReactDOM from "react-dom";
import {RaisedButton, List, ListItem, Avatar} from "material-ui";
import {FileFolder} from "material-ui/lib/svg-icons";

import Context from "../framework/context/Context";
import ReactViewModel from "../framework/react/ReactViewModel";
import DucklingComponent from '../framework/react/DucklingComponent';
import {onPromiseError} from '../framework/error/ErrorHandler';
import {JsonLoader} from "../util/JsonLoader";
import FileDialog from '../util/FileDialog';
import {join, home, basename} from '../util/Path';
import Project from "../framework/project/Project";
import ViewModel from "../framework/ViewModel";
import ProjectVM from "./ProjectVM";

interface ProjectModel {
    title : string,
    path : string
}

interface ProjectComponentProps {
    key : string,
    data : ProjectModel

    onClick();
}
class ProjectComponent extends React.Component<ProjectComponentProps, any> {
    render() {
        return (
            <ListItem
                primaryText={this.props.data.title}
                secondaryText={this.props.data.path}
                leftAvatar={<Avatar icon={<FileFolder />} />}
                onClick={this.props.onClick} />
        );
    }
}

interface ProjectListProps {
    projects : ProjectModel [];

    openProject(project : ProjectModel);
}
class ProjectListComponent extends React.Component<ProjectListProps,any> {
    private styles = {
        projectList: {
            width: "375px",
            overflowY: "auto",
            overflowX: "hidden",
            height: "100%"
        }
    };

    render() {
        return (
            <List style={this.styles.projectList}>
                {this.props.projects.map((project) => {
                    return (
                        <ProjectComponent
                            key={project.path}
                            data={project}
                            onClick={() => this.props.openProject(project)} />
                    );
                })}
            </List>
        );
    }
}

interface SplashScreenState {
    projects : ProjectModel [];
    version : string;
}
export default class SplashScreenView extends DucklingComponent<any, SplashScreenState> {
    private fileDialog : FileDialog;

    protected onCreate() {
        this.loadProjects();
        this.state = {
            projects : [],
            version : "0.0.1"
        };
    }

    componentDidMount() {
        this.fileDialog = this.ducklingContext.getSharedObjectByKey("util.FileDialog");
    }

    render() {
        return (
            <div className="splash-screen">
                <div className="left-section">
                    <ProjectListComponent
                        projects={this.state.projects}
                        openProject={(project) => this.openProject(project) } />
                    <div className="actions">
                        <RaisedButton onMouseUp={(event) => this.newProject(event)} label="NEW PROJECT" />
                    </div>
                </div>
                <div className="right-section">
                    <div className="duckling-title">
                        <div className="duckling-name">Duckling</div>
                        <div className="duckling-version">{this.state.version}</div>
                    </div>
                </div>
                <div className="the-duck"> </div>
            </div>
        );
    }

    private saveProjects(projects : ProjectModel[]) {
        var loader = new JsonLoader();
        loader.saveJsonToPath(this.projectListPath, JSON.stringify(projects));
    }

    private loadProjects() {
        var loader = new JsonLoader();
        loader.getJsonFromPath(this.projectListPath).then((json) => {
            if (json) {
                this.setState({
                    version : this.state.version,
                    projects : JSON.parse(json)
                });
            }
        });
    }

    private get projectListPath() {
        return join(home(),".duckling","recent_projects.json");
    }

    private newProject(event) {
        this.fileDialog.getDirName().then((dirName : string) => {
            this.openProject({
                path : dirName,
                title : basename(dirName)
            });
        }, onPromiseError(this.ducklingContext));
    }

    private reorderProject(openedProject) {
        var projects = this.state.projects;

        projects = projects.filter((project) => project.path !== openedProject.path);
        projects = ([openedProject].concat(projects)).slice(0,8);

        this.setState({
            projects : projects,
            version : this.state.version
        });
        this.saveProjects(projects);
    }

    private openProject(project : ProjectModel) {
        this.ducklingContext.systemWindow.clearFixedSize();
        var projectModel = new Project(project.title, project.path);
        var projectVM = new ProjectVM();
        var vm = ViewModel.findViewModel(ReactDOM.findDOMNode(this) as HTMLElement);
        this.reorderProject(project);

        vm.replaceWithView(projectVM, projectModel);
    }
}

export function SplashScreenVMFactory() {
    return new ReactViewModel(SplashScreenView);
}
