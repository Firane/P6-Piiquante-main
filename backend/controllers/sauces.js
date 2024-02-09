const Sauce = require("../models/sauces");
const auth = require("../middleware/auth");
const { log, assert } = require("console");

exports.createSauce = (req, res, next) => {
  const sauceData = JSON.parse(req.body.sauce);
  let sauce = new Sauce({
    userId: req.auth.userId,
    name: sauceData.name,
    manufacturer: sauceData.manufacturer,
    description: sauceData.description,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    mainPepper: sauceData.mainPepper,
    heat: sauceData.heat,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "La sauce a bien été enregistrée !",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res
          .status(404)
          .json({ message: "Aucune sauce correspondante." });
      }
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.modOneSauce = (req, res, next) => {
  const sauceData = JSON.parse(req.body.sauce);
  if (!req.file) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.sauce.name,
          manufacturer: req.body.sauce.manufacturer,
          description: req.body.sauce.description,
          mainPepper: req.body.sauce.mainPepper,
          heat: req.body.sauce.heat,
        },
      }
    );
  }
  Sauce.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: sauceData.name,
        manufacturer: sauceData.manufacturer,
        description: sauceData.description,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
        mainPepper: sauceData.mainPepper,
        heat: sauceData.heat,
      },
    }
  )
    .then(() => {
      res.status(201).json({
        message: "La sauce a bien été updated !",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Il va falloir trouver comment obtenir lid de la sauce dans la db, peut etre dans findOneSauce

exports.deleteOneSauce = async (req, res, next) => {
  const sauceId = req.params.id;
  console.log(sauceId);

  try {
    const deletedSauce = await Sauce.findByIdAndDelete(sauceId);

    if (!deletedSauce) {
      return res.status(404).json({ message: "La sauce n'a pas été trouvée." });
    }
    return res
      .status(201)
      .json({ message: "La sauce a été supprimée avec succès." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Une erreur est survenue lors de la supression de la sauce.",
    });
  }
};

exports.likeOneSauce = (req, res, next) => {
  const whatUserWhatLike = {
    userId: req.auth.userId,
    likeType: req.body.like,
  };
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (whatUserWhatLike.likeType === -1) {
        console.log('Cest un disklike');
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $set: {
              dislikes: sauce.dislikes + 1,
            },
            $push: {
              usersDisliked: whatUserWhatLike.userId,
            }
          }
        )
        .then(() => {
          res.status(201).json({
            message : "Les likes ont été mis à jour.",
          })
        })};
        if (whatUserWhatLike.likeType === +1) {
          console.log('Cest un like');
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $set: {
                likes: sauce.likes + 1,
              },
              $push: {
                usersLiked: whatUserWhatLike.userId,
              }
            }
          )
          .then(() => {
            res.status(201).json({
              message : "Les likes ont été mis à jour.",
            })
          })};
          if (whatUserWhatLike.likeType === 0) {
            console.log('Cest un neutral');

            // const findTheUserInLikes = sauce.usersDisliked.find(whatUserWhatLike.userId);
            console.log(sauce.usersLiked);
            console.log(whatUserWhatLike.userId);
            const isTheUserInLikes = sauce.usersLiked.includes(whatUserWhatLike.userId);
            const isTheUserInDisikes = sauce.usersDisliked.includes(whatUserWhatLike.userId);
            console.log(isTheUserInDisikes, isTheUserInLikes);
            if(isTheUserInLikes){
              Sauce.updateOne(
                { _id: req.params.id },
                {
                  $set: {
                    likes: sauce.likes - 1,
                  },
                  $pull: {
                    usersLiked: whatUserWhatLike.userId,
                  }
                }
              ).then(() => {
                res.status(201).json({
                  message : "Les likes ont été mis à jour.",
                })
              })}
              if(isTheUserInDisikes){
                Sauce.updateOne(
                  { _id: req.params.id },
                  {
                    $set: {
                      dislikes: sauce.dislikes - 1,
                    },
                    $pull: {
                      usersDisliked: whatUserWhatLike.userId,
                    }
                  }
                ).then(() => {
                  res.status(201).json({
                    message : "Les likes ont été mis à jour.",
                  })
                })
              };
            }
            
      })
  .catch((error) => {
      res.status(400).json({ error: error });
    });
};
