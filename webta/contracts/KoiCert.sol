// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract KoiCert {
    
    struct KoiData {
        string id;              // ID Unik (KOI-888)
        string variety;         // Kohaku, Showa, dll
        string breeder;         // Dainichi, Lokal, dll
        string gender;          // Male, Female, Unknown
        string age;             // Tosai, Nisai, dll
        uint256 size;           // Ukuran dalam cm
        string condition;       // Sehat, Minor defect
        string photoUrl;        // URL Foto Ikan (Supabase)
        string certUrl;         // URL Sertifikat Asli (Opsional)
        string contestUrl;      // URL Sertifikat Lomba (Opsional)
        uint256 timestamp;      // Tanggal pendataan
        address issuer;         // Wallet Admin
    }

    mapping(string => KoiData) public koiRegistry;
    
    event KoiMinted(string indexed id, string variety, address indexed issuer);

    function mintCertificate(
        string memory _id,
        string memory _variety,
        string memory _breeder,
        string memory _gender,
        string memory _age,
        uint256 _size,
        string memory _condition,
        string memory _photoUrl,
        string memory _certUrl,
        string memory _contestUrl
    ) public {
        require(bytes(koiRegistry[_id].id).length == 0, "ID Koi sudah terdaftar!");

        KoiData memory newKoi = KoiData({
            id: _id,
            variety: _variety,
            breeder: _breeder,
            gender: _gender,
            age: _age,
            size: _size,
            condition: _condition,
            photoUrl: _photoUrl,
            certUrl: _certUrl,
            contestUrl: _contestUrl,
            timestamp: block.timestamp,
            issuer: msg.sender
        });

        koiRegistry[_id] = newKoi;
        emit KoiMinted(_id, _variety, msg.sender);
    }

    function getKoi(string memory _id) public view returns (KoiData memory) {
        return koiRegistry[_id];
    }
}