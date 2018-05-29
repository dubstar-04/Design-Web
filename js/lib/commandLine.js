"use strict";

function CommandLine(cmd_Line) {

    this.cmdLine = cmd_Line;
    this.prompt = "Command:";
    this.command = "";
    this.update();

}

CommandLine.prototype.clearPrompt = function () {
    var currentPrompt = this.prompt;
    this.prompt = "";
    this.prompt = currentPrompt;
    this.command = "";
    this.update();
}

CommandLine.prototype.resetPrompt = function () {
    this.prompt = "";
    this.prompt = "Command:";
    this.command = "";
    this.update();
}

CommandLine.prototype.setPrompt = function (index) {
    //var position = previous ? points.length : points.length+2;
    console.log("[CommandLIne.setPrompt] Index: ", index)
    console.log("[CommandLIne.setPrompt] type: ", activeCommand.type)
    this.prompt = activeCommand.type + ": " + activeCommand.prompt(Number(index));
    this.update();
}

CommandLine.prototype.update = function () {
    this.cmdLine.value = this.prompt + this.command
}

CommandLine.prototype.handleKeys = function (e) {
    var charCode = (e.charCode) ? e.charCode : e.keyCode;
    console.log("[CommandLine.handleKeys] - Key pressed - char:" + charCode + " String:" + String.fromCharCode(charCode))

    switch (charCode) {

        case 8: //Backspace
            this.backPressed(e);
            break;
        case 13: //Enter
            this.enterPressed(e);
            break;
        case 27: // Escape
            var data = true;
            sceneControl("RightClick", data);
            break;
        case 32: // space
            this.enterPressed(e);
            break;
        case 37: // Left-Arrow
            this.leftPressed(e);
            break;
        case 38: // Up-Arrow
            this.previousCommand("up");
            break;
        case 39: // Right-Arrow
            break;
        case 40: // Down-Arrow
            this.previousCommand("down");
            break;
        case 46: // Delete
			this.deletePressed(e)
            break;
        default:
            this.command = this.command + String.fromCharCode(charCode);
            this.update();
            break;

    }
}

CommandLine.prototype.deletePressed = function (event) {
    if (this.cmdLine.value.length === this.prompt.length) {
       event.preventDefault();
    }
	sceneControl('Enter', ['E'] )
	console.log("[CommandLine.deletePressed]")
}

CommandLine.prototype.backPressed = function (event) {
    if (this.cmdLine.value.length === this.prompt.length) {
       event.preventDefault();
    }
}

CommandLine.prototype.leftPressed = function (event) {
    if (this.cmdLine.value.slice(0, this.cmdLine.selectionStart).length === this.prompt.length) {
        event.preventDefault();
    }
}

CommandLine.prototype.previousCommand = function (direction) {

    if (direction === "up") {
        if (lastCommand.length > 0 && lastCommandPosition < (lastCommand.length - 1)) {
            lastCommandPosition++;
            this.command = lastCommand[lastCommandPosition];
            this.update();
        }
        console.log("[CommandLine.previousCommand] LastCommandPosition: " + lastCommandPosition)
    } else if (direction === "down") {
        if (lastCommandPosition > 0) {
            lastCommandPosition--;
            this.command = lastCommand[lastCommandPosition];
            this.update();
        } else if (lastCommandPosition === 0) {
            reset();
            console.log("[CommandLine.previousCommand] LastCommandPosition: " + lastCommandPosition);

        }
    }
}

CommandLine.prototype.enterPressed = function (event) {
    event.preventDefault();
    //console.log(" UI_Scene.js - Return Pressed")
    
    if (this.cmdLine.value.length > this.prompt.length) {
        //get the inputprompt and remove the prompt text
        var inputCommand = this.cmdLine.value.slice(this.prompt.length)
        console.log("[CommandLine.enterPressed] - Command:", inputCommand)
        var data = [inputCommand]
        //console.log(data[0])
        sceneControl("Enter", data);
    } else {
        var data = ["reset-repeat"];
        sceneControl("Enter", data);
    }

}

CommandLine.prototype.mouseup = function (event){
    console.log("[CommandLine.mousedown]")
    
this.cmdLine.selectionStart = this.cmdLine.selectionEnd = this.cmdLine.value.length;
    
}