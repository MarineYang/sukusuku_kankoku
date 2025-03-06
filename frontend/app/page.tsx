import React from 'react';
import { Container, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import styled from 'styled-components';
import FeatureCard from './components/feature_card';
import Footer from './components/footer';
const images = [
  "/images/example1.jpg",
  "/images/example2.jpg",
  "/images/example3.jpg",
  "/images/example4.jpg",
  "/images/example1.jpg",
  "/images/example2.jpg",
];

export default function Home() {
  return (
    <div>
      <div className="hero-section">
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            <strong>매일매일</strong><br />
            <strong>라인으로 보내주니까요</strong>
          </Typography>
          
          <div className="marquee-container">
            <div className="marquee-content">
              {images.map((src, index) => (
                <img key={index} src={src} alt={`언어 학습 예시${index + 1}`} />
              ))}
              {images.map((src, index) => (
                <img key={`repeat-${index}`} src={src} alt={`언어 학습 예시${index + 1}`} />
              ))}
            </div>
          </div>
          
          <Button 
            href="/subscriptions" 
            variant="contained" 
            size="large" 
            sx={{ mt: 4, borderRadius: 28, px: 4, py: 1.5 }}
          >
            지금 시작하기
          </Button>
        </Container>
      </div>
      
      <div className="feature-section">
        <Container>
          <Typography variant="h3" component="h2" gutterBottom>
            <strong>1분의 여유만으로 </strong><br />
            <strong>언제, 어디서나</strong>
          </Typography>
          
          {/* 카드 레이아웃 일단은 이렇게 두자. 추후에 동적으로 수정 . */}
          <Grid container spacing={4} sx={{ mt: 6 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
              <FeatureCard 
                image="/images/feature1.jpg"
                title="매일 새로운 표현"
                description="매일 아침 8시, 당신의 레벨에 맞는 새로운 표현을 라인으로 받아보세요."
              />
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
              <FeatureCard 
                image="/images/feature2.jpg"
                title="상세한 설명"
                description="원어민이 실제로 사용하는 표현과 함께 상세한 설명을 제공합니다."
              />
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
              <FeatureCard 
                image="/images/feature3.jpg"
                title="다양한 언어"
                description="영어, 한국어 언어를 선택할 수 있습니다."
              />
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
      
      <div className="cta-section">
        <Container>
          <Typography variant="h3" component="h2" gutterBottom>
            <strong>오늘부터 우리</strong><br />
            <strong>같이 해봐요</strong>
          </Typography>
          <Typography variant="h6" component="p" sx={{ mb: 4 }}>
            당신의 내일은 오늘보다 더 멋질 거예요
          </Typography>
          <Button 
            href="/subscriptions" 
            variant="contained" 
            size="large" 
            sx={{ borderRadius: 28, px: 4, py: 1.5 }}
          >
            최저가로 시작하기
          </Button>
        </Container>
      </div>
    </div>
  );
};
