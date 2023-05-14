import Mahasiswa from "../models/mahasiswaModel.js";
import Ipk from "../models/ipkModel.js";
import db from "../config/database.js";

export const getAllMahasiswa = async (req, res) => {
  try {
    const mahasiswa = await db.query("SELECT m.id ,m.name, m.nim , m.nomorIjasah ,  i.prodi FROM mahasiswa m LEFT JOIN ipk i on i.nim = m.nim");
    res.json(mahasiswa[0]);
  } catch (error) {
    console.error(error);
  }
};

export const createMahasiswa = async (req, res) => {
  const t = await db.transaction();
  try {
    const { name, nim, nomorIjasah, prodi } = req.body;
    await Mahasiswa.create(
      {
        name: name,
        nim: nim,
        nomorIjasah: nomorIjasah,
      },
      { transaction: t }
    );

    await Ipk.create(
      {
        nim: nim,
        prodi: prodi,
      },
      { transaction: t }
    );
    t.commit();
    return res.status(201).send({
      status: {
        msg: "Create mahasiswa berhasil",
      },
    });
  } catch (error) {
    console.log(error);
    await t.rollback();
  }
};

export const updateMahasiswa = async (req, res) => {
  const t = await db.transaction();
  const { name, nomorIjasah, prodi } = req.body;
  const { id } = req.params;
  const mahasiswa = await Mahasiswa.findAll({
    where: {
      id: id,
    },
  });
  const nim = mahasiswa[0].nim;
  try {
    await Mahasiswa.update(
      {
        name: name,
        nomorIjasah: nomorIjasah,
      },
      {
        where: {
          nim: nim,
        },
      },
      {
        transaction: t,
      }
    );

    await Ipk.update(
      {
        prodi: prodi,
      },
      {
        where: {
          nim: nim,
        },
      },
      {
        transaction: t,
      }
    );
    return res.status(200).send({
      status: {
        msg: "Data berhasil di Update",
      },
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
  }
};

export const deleteMahasiswa = async (req, res) => {
  const t = await db.transaction();
  const { id } = req.params;
  console.log(id);
  const mahasiswa = await Mahasiswa.findAll({
    where: {
      id: id,
    },
  });
  const nim = mahasiswa[0].nim;
  try {
    await Mahasiswa.destroy(
      {
        where: {
          id: id,
        },
      },
      { transaction: t }
    );

    Ipk.destroy(
      {
        where: {
          nim: nim,
        },
      },
      {
        transaction: t,
      }
    );
    return res.sendStatus(200);
  } catch (error) {
    await t.rollback();
    console.error(error);
  }
};
