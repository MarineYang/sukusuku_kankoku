import { Card, CardContent, CardMedia, Typography } from "@mui/material";

interface FeatureCardProps {
    image: string;
    title: string;
    description: string;
}

export default function FeatureCard({ image, title, description }: FeatureCardProps) {
    return (
        <Card sx={{ height: '100%' }}>
            <CardMedia
                component="img"
                height="200"
                image={image}
                alt={title}
      />
        <CardContent>
          <Typography variant="h5" component="h3" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
    </Card>
    );
}