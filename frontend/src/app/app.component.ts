import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Note the correction here to 'styleUrls'
})
export class AppComponent implements OnInit {
  title = 'Template';

  ngOnInit() {
    // Ensure the script is loaded before calling the function
    this.loadScripts();
  }

  loadScripts() {
    const script = document.createElement('script');
    script.src = 'assets/js/animation.js'; // Adjust the path if necessary
    script.onload = () => {
      console.log("Script loaded, attaching event listeners");
      (window as any).toggleSuggestions();
      (window as any).toggleInventory();
    };
    document.body.appendChild(script);
  }
}
