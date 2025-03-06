import { Container, Grid, Typography } from "@mui/material";

export default function Footer() {
    return (
        <footer className="footer-section" style={{ backgroundColor: 'black', padding: '40px 0', marginTop: '60px' }}>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography style={{ color: 'white' }} variant="h6" component="h3" gutterBottom>
                <strong>SKUSKU KANKOKU</strong>
              </Typography>
              <Typography style={{ color: 'white' }} variant="body2" color="text.secondary">
                매일 새로운 언어 표현을 라인으로 받아보세요.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography style={{ color: 'white' }} variant="h6" component="h3" gutterBottom>
                <strong>연락처</strong>
              </Typography>
              <Typography style={{ color: 'white' }} variant="body2" color="text.secondary">
                이메일: contact@skuskukankoku.com<br />
                전화: 010-4188-9919
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography style={{ color: 'white' }} variant="h6" component="h3" gutterBottom>
                <strong>회사 정보</strong>
              </Typography>
              <Typography style={{ color: 'white' }} variant="body2" color="text.secondary">
                사업자 등록번호: 000-00-00000<br />
                통신판매업 신고번호: 2025-서울종로-0000<br />
                주소: 용인시 기흥구 신갈동 63
              </Typography>
            </Grid>
          </Grid>
          
          <div style={{ marginTop: '40px', borderTop: '1px solid #ddd', paddingTop: '20px', textAlign: 'center' }}>
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
              <Grid item>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', margin: '0 10px' }}>
                  <i className="fab fa-linkedin"></i>
                </a>
              </Grid>
              <Grid item>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'white', margin: '0 10px' }}>
                  <i className="fab fa-instagram"></i>
                </a>
              </Grid>
              <Grid item>
                <a href="https://line.me" target="_blank" rel="noopener noreferrer" style={{ color: 'white', margin: '0 10px' }}>
                  <i className="fab fa-line"></i>
                </a>
              </Grid>
            </Grid>
            <Typography style={{ color: 'white' }} variant="body2" color="text.secondary">
              &copy; {new Date().getFullYear()} DAILY COOKIE. All rights reserved.
            </Typography>
            <Typography style={{ color: 'white' }} variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <a href="/privacy-policy" style={{ color: 'white', textDecoration: 'underline', marginRight: '15px' }}>
                개인정보처리방침
              </a>
              <a href="/terms-of-service" style={{ color: 'white', textDecoration: 'underline' }}>
                이용약관
              </a>
            </Typography>
          </div>
        </Container>
      </footer>
    );
}
