import React, {Component} from 'react';

class Headers extends Component {
  render() {
      return (
    <nav class="navbar navbar-expand-lg navbar-light bg-danger" id="nav-header">
      <a class="navbar-brand text-light" href="#">
      <h1 className="app-name ml-4 mb-0 text-white">
      CHẨN ĐOÁN BỆNH PHỔI VỚI ẢNH X -QUANG
      </h1>
      
      </a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      
    </nav>
      )
  }
}

export default Headers;
