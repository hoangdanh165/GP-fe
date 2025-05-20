import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import paths from "../../routes/paths";
import Footer from "./Footer";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const LandingPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { auth } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axiosPrivate.get(`api/v1/services/`);

        setServices(res.data);
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const testimonials = [
    {
      content:
        "Amazing service! They diagnosed my car problem in no time and fixed it quickly.",
      name: "Nguyen Van An",
    },
    {
      content:
        "Super friendly staff and very clean workshop. Highly recommend.",
      name: "Jessica Lee",
    },
    {
      content:
        "The chatbot helped me find the right service instantly. Love the convenience!",
      name: "Tran Thi Hoa",
    },
    {
      content:
        "Good pricing and no hidden fees. I appreciate the transparency.",
      name: "Mark Thompson",
    },
    {
      content:
        "Technicians are skilled and professional. My car runs smoother now.",
      name: "Le Van Minh",
    },
    {
      content:
        "Modern equipment and detailed explanation of what was done. Impressed!",
      name: "Anna Johnson",
    },
    {
      content: "Fast and reliable. Booking via their platform was a breeze.",
      name: "Pham Thi Linh",
    },
    {
      content:
        "Everything was done on time and with great care. I'm coming back.",
      name: "David Brown",
    },
    {
      content: "Great experience. I even got a reminder before my appointment.",
      name: "Nguyen Huu Hieu",
    },
    {
      content:
        "The chatbot is actually useful, not like other sites I've used.",
      name: "Emily Smith",
    },
    {
      content:
        "They treated my car like their own. Excellent customer service.",
      name: "Vo Tuan Kiet",
    },
    {
      content: "Booking was smooth, service was fast, and price was fair.",
      name: "Michael Davis",
    },
    {
      content:
        "I love how modern the garage looks. Really gives me confidence.",
      name: "Dang Thi Mai",
    },
    {
      content: "Fast turnaround and clear communication. 5 stars from me.",
      name: "Christopher Wilson",
    },
    {
      content: "They noticed things even I missed. Very thorough inspection.",
      name: "Hoang Van Tuan",
    },
    {
      content:
        "Easy to book, fast service, and polite staff. Can't ask for more.",
      name: "Sarah Garcia",
    },
    {
      content: "The support I received through their chatbot was top-tier.",
      name: "Nguyen Ngoc Bao",
    },
    {
      content: "They explained all the options before doing anything. Respect!",
      name: "John Anderson",
    },
    {
      content:
        "Service was great from start to finish. I'll recommend to friends.",
      name: "Phan Quoc Hung",
    },
    {
      content: "They really care about customer satisfaction. A rare find.",
      name: "Lisa Martin",
    },
  ];

  return (
    <>
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          {/* Logo */}
          <Box
            component="img"
            src="/logo.png"
            alt="Logo"
            sx={{
              width: 150,
              height: 60,
              borderRadius: 2,
              objectFit: "cover",
            }}
          />

          <Box sx={{ flexGrow: 1 }} />

          {auth?.fullName ? (
            <Button
              color="primary"
              variant="text"
              onClick={() => navigate("/")}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              {auth.fullName}{" "}
              {auth.role === "customer" ? "(Customer)" : "(Admin)"}
            </Button>
          ) : (
            <>
              <Button
                color="primary"
                variant="outlined"
                sx={{ mr: 1 }}
                onClick={() => navigate(paths.sign_in)}
              >
                Sign In
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={() => navigate(paths.sign_up)}
              >
                Sign Up
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ py: 8, textAlign: "center", bgcolor: "#f5f5f5" }}>
        <Container>
          <Typography variant="h3" gutterBottom>
            Welcome to Prestige Auto Garage!
          </Typography>
          <Typography variant="h6" color="textSecondary" paragraph>
            Premium car service & maintenance – fast, reliable, and trusted by
            thousands!
          </Typography>
          {auth?.role === "customer" && (
            <Button
              onClick={() => navigate(paths.book_your_appointment)}
              variant="contained"
              color="primary"
              size="large"
            >
              Book Appointment!
            </Button>
          )}
        </Container>
      </Box>

      {/* About Us */}
      <Box sx={{ py: 6 }}>
        <Container>
          <Typography variant="h4" gutterBottom>
            About Us
          </Typography>
          <Typography color="textSecondary">
            Prestige Auto Garage has been serving customers with top-notch
            automotive repair and maintenance services for over 10 years. Our
            certified professionals ensure your vehicle gets the care it
            deserves.
          </Typography>
        </Container>
      </Box>

      {/* Why Choose Us */}
      <Box sx={{ py: 6, bgcolor: "#fafafa" }}>
        <Container>
          <Typography variant="h4" gutterBottom>
            Why Choose Us?
          </Typography>
          <Grid container spacing={3}>
            {[
              {
                title: "Skilled Technicians",
                description:
                  "Our team consists of highly trained and certified professionals with years of hands-on experience in automotive repair and maintenance.",
              },
              {
                title: "Modern Equipment",
                description:
                  "We use the latest diagnostic tools and repair equipment to ensure precision, efficiency, and the highest quality of service.",
              },
              {
                title: "Fair and Transparent Pricing",
                description:
                  "We offer competitive pricing with no hidden fees. You’ll always know what you’re paying for, and why.",
              },
              {
                title: "Smart Chatbot Support",
                description:
                  "Need assistance anytime? Our intelligent chatbot is available 24/7 to help you book appointments and answer your questions instantly.",
              },
            ].map((item, idx) => (
              <Grid item xs={12} md={3} key={idx} sx={{ height: "100%" }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    height: "170px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ flexGrow: 1 }}
                  >
                    {item.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: 6 }}>
        <Container>
          <Typography variant="h4" gutterBottom>
            Our Services
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={3} // Hiện 3 service mỗi lần
              slidesToScroll={3} // Cuộn 1 service mỗi lần
              autoplay={true}
              autoplaySpeed={2500} // Tự chạy 3 giây/lần
              swipeToSlide={true} // Kéo vuốt được luôn
              pauseOnHover={true} // Dừng khi hover chuột
              arrows={true} // Mũi tên điều hướng
              responsive={[
                {
                  breakpoint: 960,
                  settings: {
                    slidesToShow: 2,
                  },
                },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 1,
                  },
                },
              ]}
            >
              {services.map((service) => (
                <Box key={service.id} sx={{ px: 1 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: 200,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6">{service.name}</Typography>
                      <Typography color="textSecondary">
                        {service.description}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ mt: 0, ml: 0 }}>
                        {Number(service.price).toLocaleString("vi-VN")} VND
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{ mt: 0, ml: 1, mb: 2 }}
                        onClick={() =>
                          navigate(
                            `${paths.book_your_appointment}?preferred-services=${service.id}`
                          )
                        }
                      >
                        Book Now
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Slider>
          )}
        </Container>
      </Box>
      {/* Testimonials */}
      <Box sx={{ py: 6, bgcolor: "#f0f0f0" }}>
        <Container>
          <Typography variant="h4" gutterBottom>
            Customer Testimonials
          </Typography>

          <Slider
            dots={true}
            infinite={true}
            speed={500}
            slidesToShow={3}
            slidesToScroll={3}
            autoplay={true}
            autoplaySpeed={2000}
            arrows={true}
            swipeToSlide={true}
            pauseOnHover={true}
            responsive={[
              {
                breakpoint: 960,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 1,
                },
              },
            ]}
          >
            {testimonials.map((t, idx) => (
              <Box key={idx} sx={{ px: 1 }}>
                <Paper
                  sx={{
                    p: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography variant="body1">"{t.content}"</Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ mt: 2, fontStyle: "italic" }}
                  >
                    – {t.name}
                  </Typography>
                </Paper>
              </Box>
            ))}
          </Slider>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default LandingPage;
