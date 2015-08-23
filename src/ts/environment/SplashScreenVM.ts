///<reference path="../framework/ViewModel.ts"/>
module environment {
    export class SplashScreenVM extends framework.ViewModel<Environment> {

        get viewFile():string {
            return "environment/framework";
        }
    }
}
