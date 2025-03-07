"use client"

import React from 'react';
import { Container, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Link from 'next/link';
import { products } from '../data';


export default function List() {
  // TODO 상품 데이터 (추후 백엔드에서 db 조회후 가져오자 .)
  
  // 숫자 포맷팅 함수
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
  };

  return (
    <div className="page-wrapper">
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          언어 학습 상품
        </Typography>
        
        <div className="product-grid">
          {products.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-badge">
                    {product.badges.map((badge, index) => (
                      <span key={index} className="badge">{badge}</span>
                    ))}
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-price-container">
                    <span className="discount-rate">{product.discountRate}%</span>
                    <span className="discounted-price">{formatPrice(product.discountedPrice)}</span>
                  </div>
                  <div className="original-price">{formatPrice(product.originalPrice)}</div>
                  
                  <div className="delivery-info">
                    <AccessTimeIcon style={{ fontSize: '14px' }} />
                    <span>종료까지 {product.deliveryTime} 남음</span>
                  </div>
                  
                  <div className="payment-badge">
                    <div className="payment-icon">N</div>
                    <div className="review-count">
                      <span>{product.reviewCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}