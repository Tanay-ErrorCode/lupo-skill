import { Container, Typography, Grid } from "@mui/material";
import { GitHub as GitHubIcon } from "@mui/icons-material";
import CustomButton from "../Button/Button";
import back from "../image_assets/back-v.png";
import theme from "../../theme";
import { Google } from "@mui/icons-material";
import { Check } from "@mui/icons-material";
import { database, storage, signInWithGooglePopup } from "../../firebaseConf";
import { ref, get, child, set } from "firebase/database";
import { Zoom, toast } from "react-toastify";

import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import bannerImage from "../image_assets/bannerImage.png";
import bannerImage2 from "../image_assets/bannerImage2.png";
import bannerImage3 from "../image_assets/bannerImage3.png";
import { Link } from "react-router-dom";

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
        height: "100%",
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
                <Typography variant="h3" fontWeight="bold">
                  Discover, Learn, Grow:{" "}
                  <span style={{ fontWeight: "normal" }}>
                    Find Live Skill-Sharing Events!
                  </span>
                </Typography>

                <Typography
                  fontSize={"1.4rem"}
                  style={{ marginTop: "2rem", marginBottom: "4rem" }}
                >
                  A dynamic open-source platform revolutionizing how we learn
                  and share skills! Whether you're an expert or an enthusiast,
                  everyone has something valuable to teach. Join events, share
                  resources, and connect with others to explore and expand your
                  knowledge. Dive in and experience the future of skill sharing
                  today!
                </Typography>
              </Grid>
              <Grid item container spacing={2}>
                <Grid item xs={12} style={{ marginTop: "3rem" }}>
                  <Typography
                    variant="h5"
                    fontWeight={600}
                    style={{ marginBottom: "1rem", marginLeft: ".3rem" }}
                  >
                    Ready to share skills ? 🧠
                  </Typography>
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
            style={{ padding: "20px", marginTop: "4rem", marginBottom: "4rem" }}
          >
            <Grid container alignItems="center">
              <Grid item xs={12} sm={6}>
                <Typography
                  fontWeight={"bold"}
                  variant="h3"
                  style={{ color: "#ffffff" }}
                >
                  Explore Learning Opportunities
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Check
                    style={{
                      color: theme.colors.primary,
                      marginRight: "1rem",
                    }}
                  />
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: theme.fontSize.textBody,
                    }}
                  >
                    Join Online Events: Learn from Industry Experts and Expand
                    Your Skillset.
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Check
                    style={{
                      color: theme.colors.primary,
                      marginRight: "1rem",
                    }}
                  />
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: theme.fontSize.textBody,
                    }}
                  >
                    Share Resources: Contribute to the Learning Community by
                    Sharing Your Knowledge.
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Check
                    style={{
                      color: theme.colors.primary,
                      marginRight: "1rem",
                    }}
                  />
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: theme.fontSize.textBody,
                    }}
                  >
                    Host Online Events: Share Your Expertise and Connect with
                    Learners Worldwide.
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Check
                    style={{
                      color: theme.colors.primary,
                      marginRight: "1rem",
                    }}
                  />
                  <span
                    style={{
                      color: "#ffffff",
                      fontSize: theme.fontSize.textBody,
                    }}
                  >
                    Read Articles: Access Valuable Resources and Stay Updated on
                    Latest Trends.
                  </span>
                </div>
              </Grid>
            </Grid>
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
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;
