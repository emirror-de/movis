# Model View Synchronization (MoViS)
A centralized state management tool that allows easy syncronization between model and view of your application.


## Introduction and Motivation
Keeping the view in sync with the model is a major task, especially when it comes to web development. It has to be solved in a clean and easy way to understand so that developers at every stage can familiarize oneself with a given code base rapidly. At the day written JavaScript is the most popular programming language used ([see Stackoverflow Developer Survey 2019](https://insights.stackoverflow.com/survey/2019#technology)), so it is not surprising that approaches to simplify this task exist like Vue.js, React, or Angular. And of course all those frameworks do more than just synchronizing. But informations about the differences and techniques they are using can be found easily by just searching the web, so I will skip explaining any further.

As with every topic, discussions about the necessity are going on. Is it really necessary to use these frameworks in order to build a solid, complex web application with a simple and clean code base? For me, a good and inspiring discussion was the one on reddit: [Whats so wrong with direct DOM manipulation?](https://www.reddit.com/r/javascript/comments/6btma7/whats_so_wrong_with_direct_dom_manipulation/).

This discussion let me to the creation of this small tool. The goal of this software is to get a synchronization between the model and view that comes along with pure JavaScript code and a clean and simple API that can be used by developers at every stage (so without using JSX or a virtual DOM etc).


## Technique
If you are familiar with JavaScript and how to use it in your browser, you probably heard about how to react to user input such as clicking a button or changing the value of a select element.
Let's take the button as an example. If the button with the id "clicksample" is being clicked, the string "I have been touched" will be logged into the browsers JavaScript console:
```javascript
let button = document.querySelector('clicksample');
button.addEventListener('click', function() {
    console.log("I have been touched");
});
```
The same idea is being used in MoViS. It creates a central variable *movis* that contains all states and triggers the registered listener functions if a state has changed. In addition to that, it saves the history of each state so it is possible to rewind to a previous state easily.

## API
The following functions are available using MoViS.

* addState(stateId, initialValue, listenerFunction)
* removeState(stateId)
* undoState(stateId)
* addStateListener(stateId, listenerFunction)
* removeStateListener(stateId, listenerFunction)

## Example
Lets stay with the button example to show the simplicity of this approach. Lets say we want to trigger two different elements when a state is changing. The first element should fade in and out depending on the state, the second shows the state itself as text.
In this example we will just use a boolean variable to keep it simple. But the state is not limited to any kind of object, every structure is possible.
### Defining the elements
The two required elements could look like this:
```html
<div id="state-text">I will contain the state as string!</div>
<div id="fading-element">I will fade in and out...</div>
```
To make it a bit prettier some CSS code could help, but we will skip that.
### Defining the listeners
To be able to respond to changes in the state, we need to define functions, one for each element that need to react. The functions can take one argument, that contains the value of the new state. So it is easy to work with it inside the function.
```javascript
let showStateString = (stateValue) => {
    document.querySelector("#state-text").innerHTML = stateValue;
};
let fadeElement = (stateValue) => {
    let elem = document.querySelector("#fading-element");
    if (stateValue) {
        elem.setAttribute('class', 'fadeOut');
    } else {
        elem.setAttribute('class', 'fadeIn');
    }
}
```
### Setting up MoViS
Now that we have both, our HTML elements and the corresponding listeners that define the behavior, we can make use of MoViS to be able to trigger them in just one line of code by changing the state. There are two options to set it up:
#### Option 1 (preferred at intialization)
```javascript
// By including movis.js, a global variable named movis is being defined
movis.addState("showAndFade", false, [showStateString, fadeElement]);
```
#### Option 2 (preferred for adding listeners at runtime)
```javascript
movis.addState("showAndFade", false);
movis.addStateListener("showAndFade", showStateString);
movis.addStateListener("showAndFade", fadeElement);
```
Thats all we need to do, connect the state with the listeners.
### Changing the state
Now that we are ready to use it, we can switch the state just by invoking one line. In the following code snippet we bind a new function to the button that switches the state for us.
```javascript
button.addEventListener('click', function() {
    movis.showAndFade = !movis.showAndFade;
});
```
Thats it! If we click the button, the state will be switched from true to false and the other way round. At the same time, the listener functions will be called and the view is being synched to the new state.
### Undo changes to the state
As mentioned before, the history of the states is being tracked as well. It is possible to restore the previous state by using the following code:
```javascript
movis.undoState("showAndFade");
```
Now the state is being set to the previous one and all listeners are called again to update the view again.
### Remove listeners and states
#### Listeners
To remove listeners from being called the following line can be used:
```javascript
// the element won't update it's innerHTML anymore afterwards
movis.removeStateListener("showAndFade", showStateString);
```
#### States
To remove states and everything that has been attached with it to movis use:
```javascript
// the state will be deleted including history and the register of listeners
movis.removeStateListener("showAndFade", showStateString);
```

## Contributions and discussions
You are very welcome to improve, extend or bug fix this project! I am also open for any questions, ideas and opinions to this approach!
Feel free to contact me or post in the issues section!
