import {Colours} from './Design-Core/core/lib/colours.js';

/* eslint-disable require-jsdoc */
class ColourPicker extends HTMLElement {
  constructor() {
    super();
    // target for colour change
    this.target;
    // callback function to return colour
    this.callback;
  }

  connectedCallback() {
    this.innerHTML = this.createColourPicker();

    const ColourPickerTable = document.getElementById('ColourPicker-table');

    const colours = [1, 2, 3, 4, 5, 6, 230, 30, 7, 8, 9, 256];

    for (let i = 0; i < colours.length; i++) {
      const ACIColour = document.createElement('div');
      ACIColour.className = 'Design-shape';
      ACIColour.style.backgroundColor = Colours.getHexColour(colours[i]);
      ACIColour.id = Colours.getHexColour(colours[i]);
      ACIColour.col = Colours.getHexColour(colours[i]);
      ACIColour.addEventListener('click', this.colourSelected.bind(this));

      ColourPickerTable.appendChild(ACIColour);
    }

    this.hideColourPicker();
  }

  createColourPicker() {
    const ColourPickerWindow = document.createElement('div');
    ColourPickerWindow.className = 'ColourPicker';
    ColourPickerWindow.id = 'ColourPickerWindow';

    const ColourPickerBody = document.createElement('div');
    ColourPickerBody.className = 'ColourPicker-body';
    ColourPickerBody.id = 'ColourPicker-body';

    ColourPickerWindow.appendChild(ColourPickerBody);

    const ColourPickerTable = document.createElement('div');
    ColourPickerTable.className = 'ColourPicker-table';
    ColourPickerTable.id = 'ColourPicker-table';

    ColourPickerBody.appendChild(ColourPickerTable);

    return ColourPickerWindow.outerHTML;
  }

  colourSelected(e) {
    const caller = e.target;
    console.log('colour selected func:', caller.id, caller.col);
    this.hideColourPicker();
    this.callback(caller.col, this.target);
  }

  showColourPicker(e, callback, target) {
    this.callback = callback;
    this.target = target;
    this.style.display = 'block';
    this.positionColourPicker(e);
  }

  hideColourPicker() {
    this.style.display = 'none';
    // see composedPath() to close with outside click
  }

  positionColourPicker(e) {
    const clickCoords = getPosition(e);
    const clickCoordsX = clickCoords.x;
    const clickCoordsY = clickCoords.y;
    const ColourPicker = document.getElementById('ColourPicker-body');

    const ColourPickerWidth = ColourPicker.offsetWidth + 4;
    const ColourPickerHeight = ColourPicker.offsetHeight + 4;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    if ((windowWidth - clickCoordsX) < ColourPickerWidth) {
      ColourPicker.style.left = windowWidth - ColourPickerWidth + 'px';
    } else {
      ColourPicker.style.left = clickCoordsX - (ColourPickerWidth / 2) + 'px';
    }

    if ((windowHeight - clickCoordsY) < ColourPickerHeight) {
      ColourPicker.style.top = windowHeight - ColourPickerHeight - 10 + 'px';
    } else {
      ColourPicker.style.top = clickCoordsY + 10 + 'px';
    }
  }

  getPosition(e) {
    let posx = 0;
    let posy = 0;

    if (e.pageX || e.pageY) {
      posx = e.pageX;
      posy = e.pageY;
    } else if (e.clientX || e.clientY) {
      posx = e.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
      posy = e.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;
    }

    return {
      x: posx,
      y: posy,
    };
  }
}

customElements.define('colour-picker', ColourPicker);
