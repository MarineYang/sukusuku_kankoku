"use client"

import React from 'react';
import { Container, Typography } from '@mui/material';

export default function List() {
    // TODO 상품 데이터 (추후에 디비에서 가져오자 )
    const products = [
        {
          id: 1,
          name: '매일 보는 영어문장(정상 포함)',
          price: '12,900원',
          image: '/images/jp_product_1.jpg'
        },
        {
          id: 2,
          name: '매일 보는 일본어문장',
          price: '12,900원',
          image: '../images/jp_product_1.jpg'
        },
        {
          id: 3,
          name: '매일 보는 중국어문장',
          price: '12,900원',
          image: '../images/jp_product_1.jpg'
        },
        {
          id: 4,
          name: '매일 보는 한국어문장',
          price: '12,900원',
          image: '../images/jp_product_1.jpg'
        }
      ];

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
              </div>
              <div className="product-info">
                <h4>{product.name}</h4>
                <p>{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}