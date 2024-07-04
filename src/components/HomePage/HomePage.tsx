import { Container, Typography, Grid, Box } from "@mui/material";
import {
  Article as ArticleIcon,
  Event as EventIcon,
  GitHub as GitHubIcon,
  Login as JoinIcon,
  Send as ShareIcon,
} from "@mui/icons-material";
import CustomButton from "../Button/Button";
import back from "../image_assets/back-v.png";
import theme from "../../theme";
import { Google } from "@mui/icons-material";
import { database, storage, signInWithGooglePopup } from "../../firebaseConf";
import { ref, get, child, set } from "firebase/database";
import { Zoom, toast } from "react-toastify";
import "../testimonial/testimonial.css";
import { motion } from "framer-motion";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import bannerImage from "../image_assets/bannerImage.png";
import bannerImage2 from "../image_assets/bannerImage2.png";
import bannerImage3 from "../image_assets/bannerImage3.png";
import { Link } from "react-router-dom";
import TestimonialsCarousel from "../testimonial/TestimonialsCarousel";
import "./HomePage.css";

const HomePage = () => {
  const loggedIn = localStorage.getItem("userUid");
  const logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    const email = response.user.email;
    const uid = response.user.uid;
    const username = response.user.displayName;
    const pic = response.user.photoURL;

    const usersRef = ref(database, "users");
    const userRef = child(usersRef, uid);

    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          localStorage.setItem("userUid", uid);
          localStorage.setItem("userPic", pic ? pic : "");
          window.location.reload();
          toast.success("Logged in successfully", { transition: Zoom });
        } else {
          set(userRef, {
            name: username,
            email: response.user.email,
            pic: pic,
            tags: "",
            banner: "",
            uid: uid,
          });

          const bannerRef = storageRef(storage, `/user-banners/banner-${uid}`);

          const images = [bannerImage, bannerImage2, bannerImage3];
          const randomImage = images[Math.floor(Math.random() * images.length)];
          fetch(randomImage)
            .then((res) => res.blob())
            .then((blob) => {
              toast.promise(
                uploadBytes(bannerRef, blob).then(() => {
                  getDownloadURL(bannerRef).then(
                    function (value) {
                      console.log(value, "banner uploaded");
                      localStorage.setItem("userUid", uid);
                      localStorage.setItem("userPic", pic ? pic : "");
                      set(userRef, {
                        name: username,
                        email: email,
                        pic: pic,
                        tags: "",
                        banner: value,
                        uid: uid,
                      });
                      window.location.reload();
                    },

                    function (error) {
                      console.log(error);
                    }
                  );
                }),
                {
                  pending: "Signing up...",
                  success: "Signed Up succesfully !",
                  error: "Failed to sign up",
                },
                { transition: Zoom }
              );
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div
      style={{
        paddingTop: "6.5em",
        height: "100%",
        overflow: "hidden",
        background:
          "radial-gradient(circle, rgb(1 126 172 / 83%) 0%, rgb(27, 79, 105) 40%, rgb(0, 0, 0) 80%)",
        // "radial-gradient(circle,navy 0%, seagreen 50%, rgba(0, 0, 0, 1) 90%)",
      }}
    >
      <Container maxWidth="xl" style={{ height: "100%", width: "100%" }}>
        <Grid
          container
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Content column */}
          <Grid
            item
            xs={12}
            lg={6}
            style={{
              color: "#ffffff",
              paddingTop: "10rem",
            }}
          >
            <Grid container direction="column" spacing={2}>
              <Grid item container>
                <motion.div
                  initial={{ opacity: 0, y: -150 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    type: "spring",
                    stiffness: 100,
                    delay: 0.5,
                  }}
                >
                  <Typography variant="h3" fontWeight="bold">
                    Discover, Learn, Grow:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      Find Live Skill-Sharing Events!
                    </span>
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -150 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    type: "spring",
                    stiffness: 100,
                    delay: 1,
                  }}
                >
                  <Typography
                    fontSize={"1.4rem"}
                    style={{ marginTop: "2rem", marginBottom: "4rem" }}
                  >
                    A dynamic open-source platform revolutionizing how we learn
                    and share skills! Whether you're an expert or an enthusiast,
                    everyone has something valuable to teach. Join events, share
                    resources, and connect with others to explore and expand
                    your knowledge. Dive in and experience the future of skill
                    sharing today!
                  </Typography>
                </motion.div>
              </Grid>
              <Grid item container spacing={2}>
                <Grid item xs={12} style={{ marginTop: "3rem" }}>
                  <motion.div
                    initial={{ opacity: 0, y: -150 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      type: "spring",
                      stiffness: 100,
                      delay: 1.5,
                    }}
                  >
                    {!loggedIn && (
                      <Typography
                        variant="h5"
                        fontWeight={600}
                        style={{ marginBottom: "1rem", marginLeft: ".3rem" }}
                      >
                        Ready to share skills ? 🧠
                      </Typography>
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -150 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      type: "spring",
                      stiffness: 100,
                      delay: 1.5,
                    }}
                  >
                    {!loggedIn && (
                      <CustomButton
                        icon={<Google />}
                        text="Continue with Google"
                        backgroundColor="#FFC0D9"
                        textColor={theme.colors.darkBackground}
                        onClick={() => logGoogleUser()}
                        colorChange={true}
                        borderColor="#FF90BC"
                      />
                    )}
                  </motion.div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          {/* Background image column */}
          <Grid
            item
            xs={12}
            lg={6}
            style={{
              marginTop: "2.2rem",
              backgroundImage: `url(${back})`,
              backgroundSize: "auto 95vh",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right",
              height: "100vh",
            }}
          />

          <Grid
            item
            xs={12}
            style={{ padding: "2rem", marginTop: "4rem", marginBottom: "4rem" }}
          >
            <Container maxWidth="xl">
              <Grid container alignItems="center">
                <Grid item xs={12} textAlign={"center"}>
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      type: "spring",
                      stiffness: 100,
                      delay: 0.5,
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight="Bold"
                      style={{
                        marginBottom: "1rem",
                        marginLeft: ".3rem",
                        color: "#ffffff",
                      }}
                    >
                      Explore Learning Opportunities
                    </Typography>
                  </motion.div>
                </Grid>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    type: "spring",
                    stiffness: 100,
                    delay: 1,
                  }}
                  style={{
                    display: "flex",
                    marginTop: "50px",
                    width: "100%",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "20px",
                  }}
                >
                  <Grid className="explore-card">
                    <JoinIcon fontSize="large" />
                    <Typography variant="h3" fontWeight={600}>
                      Join Online Events
                    </Typography>
                    <Typography fontSize={"1rem"}>
                      Learn from Industry Experts and Expand Your Skillset.
                    </Typography>
                  </Grid>
                  <Grid className="explore-card">
                    <ShareIcon fontSize="large" />
                    <Typography variant="h3" fontWeight={600}>
                      Share Resources
                    </Typography>
                    <Typography fontSize={"1rem"}>
                      Contribute to the Learning Community by Sharing Your
                      Knowledge.
                    </Typography>
                  </Grid>
                  <Grid className="explore-card">
                    <EventIcon fontSize="large" />
                    <Typography variant="h3" fontWeight={600}>
                      Host Online Events
                    </Typography>
                    <Typography fontSize={"1rem"}>
                      Share Your Expertise and Connect with Learners Worldwide.
                    </Typography>
                  </Grid>
                  <Grid className="explore-card">
                    <ArticleIcon fontSize="large" />
                    <Typography variant="h3" fontWeight={600}>
                      Read Articles
                    </Typography>
                    <Typography fontSize={"1rem"}>
                      Access Valuable Resources and Stay Updated on Latest
                      Trends.
                    </Typography>
                  </Grid>
                </motion.div>
              </Grid>
            </Container>
            {/* testimonial */}
            <Container maxWidth="xl">
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                marginTop="100px"
              >
                <Grid item xs={12} textAlign={"center"}>
                  <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      type: "spring",
                      stiffness: 100,
                      delay: 0.5,
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight="Bold"
                      style={{
                        marginBottom: "1rem",
                        marginLeft: ".3rem",
                        color: "#ffffff",
                      }}
                    >
                      Happy Users
                    </Typography>
                  </motion.div>
                </Grid>
                <Grid item xs={12}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1,
                      type: "spring",
                      stiffness: 100,
                      delay: 1,
                    }}
                  >
                    <Box mt={4} mb={8}>
                      <TestimonialsCarousel />
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </Container>
            {/* buttons */}
            <Grid
              container
              alignItems="center"
              style={{ marginTop: "12rem", marginBottom: "4rem" }}
            >
              <Grid
                item
                xs={12}
                sm={6}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <motion.div
                  initial={{ opacity: 0, x: -150 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    type: "spring",
                    stiffness: 100,
                    delay: 0.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={300}
                    style={{
                      marginBottom: "1rem",
                      marginLeft: ".3rem",
                      color: theme.colors.brightBackground,
                    }}
                  >
                    Give us a star! ⭐
                  </Typography>
                  <Link
                    to="https://github.com/Tanay-ErrorCode/lupo-skill"
                    style={{ textDecoration: "none" }}
                  >
                    <CustomButton
                      icon={<GitHubIcon />}
                      text="Star on GitHub"
                      backgroundColor={theme.colors.primary}
                      textColor={theme.colors.brightBackground}
                      onClick={() => console.log("Get Started")}
                      borderColor={theme.colors.secondaryLight}
                    />
                  </Link>
                </motion.div>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <motion.div
                  initial={{ opacity: 0, x: 150 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1,
                    type: "spring",
                    stiffness: 100,
                    delay: 0.5,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight={300}
                    style={{
                      marginBottom: "1rem",
                      marginLeft: ".3rem",
                      color: theme.colors.brightBackground,
                    }}
                  >
                    Make your mark! 🎯
                  </Typography>
                  <Link
                    to={"https://github.com/Tanay-ErrorCode/lupo-skill"}
                    style={{ textDecoration: "none" }}
                  >
                    <CustomButton
                      icon={<GitHubIcon />}
                      text="Contribute Now"
                      backgroundColor={theme.colors.primary}
                      textColor={theme.colors.brightBackground}
                      onClick={() => console.log("Get Started")}
                      borderColor={theme.colors.secondaryLight}
                    />
                  </Link>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;
