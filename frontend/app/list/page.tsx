"use client"

import React from 'react';
import { Container, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';


export default function List() {
  // TODO 상품 데이터 (추후 백엔드에서 db 조회후 가져오자 .)
  const products = [
    {
      id: 1,
      name: '미드 프렌즈 속 영어 표현',
      originalPrice: 42000,
      discountRate: 30,
      discountedPrice: 29400,
      image: '/images/jp_product_1.jpg',
      badges: ['180일', '365일'],
      deliveryTime: '23:55:25',
      paymentMethod: 'pay',
      reviewCount: 374
    },
    {
      id: 2,
      name: '매일 보는 일본어문장',
      originalPrice: 42000,
      discountRate: 30,
      discountedPrice: 29400,
      image: '/images/jp_product_1.jpg',
      badges: ['180일', '365일'],
      deliveryTime: '23:55:25',
      paymentMethod: 'pay',
      reviewCount: 256
    },
    {
      id: 3,
      name: '매일 보는 중국어문장',
      originalPrice: 42000,
      discountRate: 30,
      discountedPrice: 29400,
      image: '/images/jp_product_1.jpg',
      badges: ['180일', '365일'],
      deliveryTime: '23:55:25',
      paymentMethod: 'pay',
      reviewCount: 189
    },
    {
      id: 4,
      name: '매일 보는 한국어문장',
      originalPrice: 42000,
      discountRate: 30,
      discountedPrice: 29400,
      image: '/images/jp_product_1.jpg',
      badges: ['180일', '365일'],
      deliveryTime: '23:55:25',
      paymentMethod: 'pay',
      reviewCount: 421
    }
  ];
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
            <div className="product-card" key={product.id}>
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
          ))}
        </div>
      </Container>
    </div>
  );
}