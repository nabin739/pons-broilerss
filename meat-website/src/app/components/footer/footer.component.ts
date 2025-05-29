import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h3>About Us</h3>
            <p>We deliver fresh, high-quality meat products directly to your doorstep. Our commitment is to provide the best quality at competitive prices.</p>
          </div>
          <div class="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a routerLink="/chicken">Chicken</a></li>
              <li><a routerLink="/country-chicken">Country Chicken</a></li>
              <li><a routerLink="/japanese-quail">Japanese Quail</a></li>
              <li><a routerLink="/turkey">Turkey</a></li>
              <li><a routerLink="/goat">Goat</a></li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Contact Us</h3>
            <ul class="contact-info">
              <li><i class="bi bi-shop"></i> PONS MUTTON STALL AND BROILERS</li>
              <li><i class="bi bi-geo-alt-fill"></i> 97, Servaikarar Street near Mattabadai Bazaar, Tuticorin - 628001</li>
              <li><i class="bi bi-telephone-fill"></i> 7904294113, 7904312330</li>
              <li><i class="bi bi-clock-fill"></i> Morning: 6am - 3pm</li>
              <li><i class="bi bi-clock-fill"></i> Evening: 6pm - 8pm</li>
            </ul>
          </div>
          <div class="footer-section">
            <h3>Follow Us</h3>
            <div class="social-links">
              <a href="#" target="_blank"><i class="bi bi-facebook"></i></a>
              <a href="#" target="_blank"><i class="bi bi-instagram"></i></a>
              <a href="#" target="_blank"><i class="bi bi-twitter"></i></a>
              <a href="#" target="_blank"><i class="bi bi-whatsapp"></i></a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2024 Fresh Meat Shop. All rights reserved.</p>
          <div class="footer-links">
            <a routerLink="/privacy-policy">Privacy Policy</a>
            <a routerLink="/terms">Terms & Conditions</a>
            <a routerLink="/refund-policy">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color:rgb(222, 37, 65);
      color: #fff;
      padding: 40px 0 20px;
      margin-top: 40px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 15px;
    }

    .footer-content {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 30px;
    }

    .footer-section h3 {
      color: #fff;
      font-size: 18px;
      margin-bottom: 15px;
      font-weight: 600;
    }

    .footer-section p {
      color: #ccc;
      line-height: 1.6;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section ul li {
      margin-bottom: 10px;
    }

    .footer-section ul li a {
      color: #ccc;
      text-decoration: none;
      transition: color 0.3s;
    }

    .footer-section ul li a:hover {
      color: #fff;
    }

    .contact-info li {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #ccc;
    }

    .social-links {
      display: flex;
      gap: 15px;
    }

    .social-links a {
      color: #fff;
      font-size: 20px;
      transition: color 0.3s;
    }

    .social-links a:hover {
      color: #c41530;
    }

    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 15px;
    }

    .footer-bottom p {
      color: #ccc;
      margin: 0;
    }

    .footer-links {
      display: flex;
      gap: 20px;
    }

    .footer-links a {
      color: #ccc;
      text-decoration: none;
      font-size: 14px;
      transition: color 0.3s;
    }

    .footer-links a:hover {
      color: #fff;
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }

      .footer-links {
        justify-content: center;
      }
    }
  `]
})
export class FooterComponent {}