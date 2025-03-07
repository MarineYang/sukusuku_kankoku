"use client"

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Container, Typography, Button, Grid, Box, Divider, 
  Tabs, Tab, Paper, FormControl, Select, MenuItem, 
  InputLabel, SelectChangeEvent 
} from '@mui/material';
import { products } from '@/app/data';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function ProductDetail() {
  const params = useParams();
  const id = params.id as string;
  const [tabValue, setTabValue] = useState(0);
  const [quantity, setQuantity] = useState('1');
  const [language, setLanguage] = useState('1');
  
  const product = products.find((p) => p.id === Number(id));
  
  if (!product) {
    return <Typography variant="h6">제품을 찾을 수 없습니다.</Typography>;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleQuantityChange = (event: SelectChangeEvent) => {
    setQuantity(event.target.value);
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  // 할인율 계산
  const discountPercent = Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100);
  
  // 가격 포맷팅
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "원";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* 상단 영역: 이미지(왼쪽) + 구매 정보(오른쪽) */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {/* 왼쪽: 상품 이미지 */}
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              width: '100%',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
        </Grid>
        
        {/* 오른쪽: 상품 정보 및 구매 버튼 */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {product.name}
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mr: 1 }}>
                {discountPercent}%
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {formatPrice(product.discountedPrice)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              {formatPrice(product.originalPrice)}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* 배지 및 배송 정보 */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', mb: 2 }}>
              {product.badges && product.badges.map((badge, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    mr: 1,
                    px: 1.5,
                    py: 0.5,
                    bgcolor: 'primary.light',
                    color: 'white',
                    borderRadius: '4px'
                  }}
                >
                  {badge}
                </Typography>
              ))}
            </Box>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {/* 옵션 선택 */}
          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel id="language-option-label">언어 옵션</InputLabel>
              <Select
                labelId="language-option-label"
                value={language}
                onChange={handleLanguageChange}
                label="언어 옵션"
              >
                <MenuItem value="1">한국어 (기본)</MenuItem>
                <MenuItem value="2">영어</MenuItem>
              </Select>
            </FormControl>
            
            {/* <FormControl fullWidth variant="outlined">
              <InputLabel id="quantity-label">수량</InputLabel>
              <Select
                labelId="quantity-label"
                value={quantity}
                onChange={handleQuantityChange}
                label="수량"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num.toString()}>{num}</MenuItem>
                ))}
              </Select>
            </FormControl> */}
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel id="quantity-label">학습기간</InputLabel>
              <Select
                labelId="quantity-label"
                value={quantity}
                onChange={handleQuantityChange}
                label="학습기간"
              >
                <MenuItem value="180">180일</MenuItem>
                <MenuItem value="365">365일</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {/* 구매 버튼 */}
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth 
                size="large"
              >
                장바구니
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                size="large"
              >
                구매하기
              </Button>
            </Grid>
          </Grid>
          
          {/* 결제 수단 */}
          <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                bgcolor: 'yellow',
                borderRadius: '50%',
                fontWeight: 'bold',
                mr: 1
              }}
            >
              N
            </Box>
            <Typography variant="body2">간편결제 가능</Typography>
          </Box>
        </Grid>
      </Grid>
      
      {/* 하단 영역: 상세 설명 탭 */}
      <Paper sx={{ width: '100%', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="상세설명" />
          <Tab label="상품후기" />
          <Tab label="Q&A" />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              상품 상세 설명
            </Typography>
            <Typography variant="body1" paragraph>
              이 상품은 매일 학습할 수 있는 일본어 문장을 제공합니다. 초급부터 고급까지 단계별로 구성되어 있어 자신의 수준에 맞게 학습할 수 있습니다.
            </Typography>
            <Typography variant="body1" paragraph>
              특징:
            </Typography>
            <ul>
              <li>매일 새로운 표현과 문장 학습</li>
              <li>실생활에서 자주 사용되는 표현 위주로 구성</li>
              <li>발음 가이드와 함께 제공</li>
              <li>한국어 번역과 상세한 설명 포함</li>
            </ul>
            <Box 
              component="img" 
              src="/images/jp_product_detail.jpg" 
              alt="상세 이미지"
              sx={{ width: '100%', mt: 3 }}
            />
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="body1">
            아직 등록된 후기가 없습니다.
          </Typography>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1">
            상품에 대한 문의사항은 여기에 남겨주세요.
          </Typography>
        </TabPanel>
      </Paper>
    </Container>
  );
} 