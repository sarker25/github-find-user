import { useEffect, useState } from "react";
import InputText from "../components/InputText";
import Card from "../components/Card";
import checkInput from "../utils/checkInput";

const TOKEN =
  "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";

const App = () => {
  const [input, setInput] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [repositories, setRepositories] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const changeHandler = (e) => {
    setInput(e.target.value);
  };
  const searchHandler = () => {
    if (!input) {
      setError("Please provide username or link");
      return;
    }
    const user = checkInput(input);
    setLoading(true);
    fetch(`https://api.github.com/users/${user}`, {
      headers: {
        Authorization: `token ${TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data);
        setLoading(false);
        if (data.message) {
          setError(data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        setError(true);
        console.log(error.message);
      });
  };

  const getAllRepo = () => {
    const user = checkInput(input);
    fetch(`https://api.github.com/users/${user}/repos`, {
      headers: {
        Authorization: `token ${TOKEN}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setRepositories(data));
  };
  useEffect(() => {
    if (!userProfile?.login) {
      return;
    }
    getAllRepo();
  }, [userProfile]);
  return (
    <>
      <InputText
        placeholder="user name"
        value={input}
        onChange={changeHandler}
        searchHandler={searchHandler}
        loading={loading}
        error={error}
      />
      {userProfile?.login && (
        <section>
          <div className="container" id="container">
            <div className="image">
              <img src={userProfile?.avatar_url} alt="image" id="img" />
            </div>
            <div className="info">
              <div className="profile-info">
                <label>Name:</label>
                <div id="name">{userProfile?.name}</div>
              </div>

              <div className="profile-info">
                <label>Portfolio:</label>
                <div id="portfolio">{userProfile?.blog}</div>
              </div>

              <div className="profile-info">
                <label>Location:</label>
                <div id="location">{userProfile?.location}</div>
              </div>

              <div className="profile-info">
                <label>Repo:</label>
                <div id="repo">{userProfile?.public_repos}</div>
              </div>

              <div className="profile-info">
                <label>Bio:</label>
                <div id="bio">{userProfile?.bio}</div>
              </div>

              <div className="profile-info">
                <label>Followers:</label>
                <div id="followers">{userProfile?.followers}</div>
              </div>
            </div>
          </div>
        </section>
      )}
      <div id="repositoriesDiv" className="grid-container">
        {repositories &&
          repositories?.map((repo) => <Card key={repo.id} repo={repo} />)}
      </div>
    </>
  );
};

export default App;