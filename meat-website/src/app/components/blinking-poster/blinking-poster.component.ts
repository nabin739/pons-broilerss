import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blinking-poster',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="blinking-posters">
      <div class="poster poster-1" [class.blink]="true">
        <i class="bi bi-truck"></i>
        <span>Free delivery on orders above ₹150</span>
      </div>
      <div class="poster poster-2" [class.blink]="true">
        <i class="bi bi-clock"></i>
        <span>Orders taken between:</span>
        <div class="timing">
          <div>Morning: 6am - 3pm</div>
          <div>Evening: 6pm - 8pm</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .blinking-posters {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .poster {
      background-color: #E31837;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      animation: blink 3s infinite;
    }

    .poster:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.2);
    }

    .poster i {
      font-size: 1rem;
    }

    .timing {
      margin-left: 20px;
      font-size: 0.8rem;
      opacity: 0.95;
    }

    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0.85; }
      100% { opacity: 1; }
    }

    @media (max-width: 768px) {
      .blinking-posters {
        width: 100%;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
      }

      .poster {
        width: calc(50% - 5px);
      }
    }
  `]
})
export class BlinkingPosterComponent {} 