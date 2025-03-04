import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import styled from 'styled-components';

const HeroSection = styled.div`
  background-color: #f8f9fa;
  padding: 80px 0;
  text-align: center;
`;

const MarqueeContainer = styled.div`
  overflow: hidden;
  width: 100%;
  max-width: 1000px;
  margin: 40px auto;
`;

const MarqueeContent = styled.div`
  display: inline-block;
  white-space: nowrap;
  animation: marquee 20s linear infinite;
  
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  
  img {
    height: 200px;
    margin: 0 15px;
    border-radius: 10px;
  }
`;

const FeatureSection = styled.div`
  padding: 80px 0;
  text-align: center;
`;

const CTASection = styled.div`
  background-color: #f8f9fa;
  padding: 80px 0;
  text-align: center;
`;

const HomePage = () => {
  return (
    <>
      <HeroSection>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            <strong>매일매일</strong><br />
            <strong>라인으로 보내주니까요</strong>
          </Typography>
          
          <MarqueeContainer>
            <MarqueeContent>
              <img src="/images/example1.jpg" alt="언어 학습 예시" />
              <img src="/images/example2.jpg" alt="언어 학습 예시" />
              <img src="/images/example3.jpg" alt="언어 학습 예시" />
              <img src="/images/example4.jpg" alt="언어 학습 예시" />
              <img src="/images/example1.jpg" alt="언어 학습 예시" />
              <img src="/images/example2.jpg" alt="언어 학습 예시" />
            </MarqueeContent>
          </MarqueeContainer>
          
          <Button 
            component={Link} 
            to="/subscriptions" 
            variant="contained" 
            size="large" 
            sx={{ mt: 4, borderRadius: 28, px: 4, py: 1.5 }}
          >
            지금 시작하기
          </Button>
        </Container>
      </HeroSection>
      
      <FeatureSection>
        <Container>
          <Typography variant="h3" component="h2" gutterBottom>
            <strong>1분의 여유가 있는</strong><br />
            <strong>언제, 어디서나</strong>
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 6 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="/images/feature1.jpg"
                  alt="Feature 1"
                />
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    매일 새로운 표현
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    매일 아침 8시, 당신의 레벨에 맞는 새로운 표현을 라인으로 받아보세요.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="/images/feature2.jpg"
                  alt="Feature 2"
                />
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    상세한 설명
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    원어민이 실제로 사용하는 표현과 함께 상세한 설명을 제공합니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image="/images/feature3.jpg"
                  alt="Feature 3"
                />
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    다양한 언어
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    영어, 한국어 언어를 선택할 수 있습니다.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </FeatureSection>
      
      <CTASection>
        <Container>
          <Typography variant="h3" component="h2" gutterBottom>
            <strong>오늘부터 우리</strong><br />
            <strong>같이 해봐요</strong>
          </Typography>
          <Typography variant="h6" component="p" sx={{ mb: 4 }}>
            당신의 내일은 오늘보다 더 멋질 거예요
          </Typography>
          <Button 
            component={Link} 
            to="/subscriptions" 
            variant="contained" 
            size="large" 
            sx={{ borderRadius: 28, px: 4, py: 1.5 }}
          >
            최저가로 시작하기
          </Button>
        </Container>
      </CTASection>
    </>
  );
};

export default HomePage; 