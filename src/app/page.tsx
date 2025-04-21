"use client";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [isOpen, setIsOpen] = useState<number | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<
    Array<{ order: number; price: number }>
  >([]);
  const [userData, setUserData] = useState<
    Array<{
      id: number;
      name: string;
      lastname: string;
      phone: string;
      email: string;
      gender: string;
      birthday: string;
    }>
  >([]);

  const [hoveredSeat, setHoveredSeat] = useState<null | {
    x: number;
    y: number;
    id: number;
  }>(null);
  const [ticketUsers, setTicketUsers] = useState<
    Array<{ id: number; name: string }>
  >([]);

  const firstClickToSeatCheck = useRef<NodeJS.Timeout | null>(null);

  //load data
  useEffect(() => {
    const parsedData = JSON.parse(
      localStorage.getItem("selected-seats") ?? "[]"
    );
    const parsedUserData = JSON.parse(
      localStorage.getItem("user-data") ?? "[]"
    );

    setUserData(parsedUserData);

    setSelectedSeats(parsedData);

    fetch("https://jsonplaceholder.typicode.com/users").then(async (res) => {
      const data = await res.json();
      setTicketUsers(data);
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("selected-seats", JSON.stringify(selectedSeats));
  }, [selectedSeats]);

  useEffect(() => {
    localStorage.setItem("user-data", JSON.stringify(userData));
  }, [userData]);

  const downIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.5 8.25L12 15.75L4.5 8.25"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const rightIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.25 4.5L15.75 12L8.25 19.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const form = (userId: number) => {
    const data = userData?.find((user) => user.id === userId);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;

      setUserData((prevData) => {
        const existingUser = prevData.find((user) => user.id === userId);

        if (existingUser) {
          return prevData.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  [name]: value,
                }
              : user
          );
        } else {
          return [
            ...prevData,
            {
              id: userId,
              name: "",
              lastname: "",
              phone: "",
              email: "",
              gender: "",
              birthday: "",
              [name]: value,
            },
          ];
        }
      });
    };

    return (
      <div className="mb-4">
        <div className="flex items-center justify-center gap-5">
          <div className="flex-1 flex flex-col my-4">
            <label htmlFor="name">İsim</label>
            <input
              className="p-2 border border-gray-300"
              type="text"
              id="name"
              name="name"
              value={data?.name ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1 flex flex-col my-4">
            <label htmlFor="lastname">Soyisim</label>
            <input
              className="p-2 border border-gray-300"
              type="text"
              id="lastname"
              name="lastname"
              value={data?.lastname ?? ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <div className="flex-1 flex flex-col my-4">
            <label htmlFor="phone">Telefon</label>
            <input
              className="p-2 border border-gray-300"
              type="text"
              id="phone"
              name="phone"
              value={data?.phone ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex-1 flex flex-col my-4">
            <label htmlFor="email">E-Posta</label>
            <input
              className="p-2 border border-gray-300"
              type="text"
              id="email"
              name="email"
              value={data?.email ?? ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <div className="flex-1 flex flex-col my-4">
            <label htmlFor="gender">Cinsiyet</label>
            <select
              className="p-2 border border-gray-300"
              id="gender"
              name="gender"
              value={data?.gender ?? ""}
              onChange={handleChange}
            >
              <option value="">Seçiniz</option>
              <option value="male">Erkek</option>
              <option value="female">Kadın</option>
              <option value="other">Diğer</option>
            </select>
          </div>

          <div className="flex-1 flex flex-col my-4">
            <label htmlFor="birthday">Doğum Tarihi</label>
            <input
              className="p-2 border border-gray-300"
              type="date"
              id="birthday"
              name="birthday"
              value={data?.birthday ?? ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    );
  };

  const totalPrice = selectedSeats.reduce((acc, item) => acc + item.price, 0);

  const seats = Array.from({ length: 76 }, (_, i) => {
    const row = Math.floor(i % 4);

    let coordinateX: number;
    let coordinateY = 87 + Math.floor(i / 4) * 15;

    if (row == 0) {
      coordinateX = 225;
    } else if (row == 1) {
      coordinateX = 234;
    } else if (row == 2) {
      coordinateX = 259;
    } else if (row == 3) {
      coordinateX = 268;
    } else {
      coordinateX = 225;
    }

    if (i > 15) {
      coordinateY = coordinateY + 12;
    }

    return {
      seat: i + 1,
      coordinateX,
      coordinateY,
    };
  });

  const save = () => {
    if (
      selectedSeats.length < 3 ||
      userData.length < 3 ||
      userData.some(
        (user) =>
          user.birthday.length == 0 ||
          user.email.length == 0 ||
          user.gender.length == 0 ||
          user.lastname.length == 0 ||
          user.name.length == 0 ||
          user.phone.length == 0
      )
    ) {
      return alert("Zorunlu alanları doldurunuz");
    }

    alert("Rezervasyon işlemi başarılı :)");
  };

  return (
    <div className="max-w-6xl mx-auto mt-20 flex justify-around gap-10 h-full">
      {hoveredSeat && (
        <div
          className="absolute bg-gray-800 text-white text-xs px-2 py-1 rounded shadow z-50"
          style={{
            left: hoveredSeat.x + 15,
            top: hoveredSeat.y,
          }}
        >
          {ticketUsers.find((ticket) => ticket.id === hoveredSeat.id)?.name}
        </div>
      )}
      <div className="flex-1">
        <svg viewBox="0 0 500 500">
          <image href="plane.png" width="500" height="500" />

          {seats.map((seat) => {
            const ticket = ticketUsers.filter(
              (ticket) => ticket.id == seat.seat
            );

            const ticketSold = ticket.length;
            const isSelected = selectedSeats
              .map((val) => val.order)
              .includes(seat.seat);

            return (
              <rect
                key={seat.seat}
                x={seat.coordinateX}
                y={seat.coordinateY}
                width="7"
                height="10"
                rx="2"
                ry="2"
                fill={ticketSold ? "#E1E1E1" : isSelected ? "#FFCC2A" : "white"}
                stroke="#E1E1E1"
                strokeWidth="0.5"
                onClick={() => {
                  if (ticketSold) {
                    return alert("Bu koltuk alınamaz.");
                  }

                  if (!isSelected && selectedSeats.length === 3) {
                    return alert("Maksimum 3 adet seçebilirsiniz");
                  }

                  if (
                    firstClickToSeatCheck.current == null &&
                    selectedSeats.length === 0
                  ) {
                    firstClickToSeatCheck.current = setTimeout(() => {
                      const shouldReload = confirm(
                        "İşleme devam etmek istiyor musunuz?"
                      );
                      if (shouldReload) {
                        location.reload();
                        localStorage.setItem(
                          "selected-seats",
                          JSON.stringify([])
                        );
                        localStorage.setItem("user-data", JSON.stringify([]));
                      }
                    }, 30000);
                  } else if (firstClickToSeatCheck.current !== null) {
                    clearTimeout(firstClickToSeatCheck.current);
                  }

                  if (isSelected) {
                    setSelectedSeats(
                      selectedSeats.filter((val) => {
                        return val.order != seat.seat;
                      })
                    );
                  } else {
                    setSelectedSeats([
                      ...selectedSeats,
                      { order: seat.seat, price: 1000 },
                    ]);
                  }
                }}
                onMouseEnter={(e) => {
                  if (ticketSold) {
                    setHoveredSeat({
                      x: e.clientX,
                      y: e.clientY,
                      id: ticket[0].id,
                    });
                  }
                }}
                onMouseLeave={() => setHoveredSeat(null)}
              />
            );
          })}
        </svg>
        <div className="flex gap-10  items-center justify-center mt-10">
          <div className="flex flex-col items-center justify-center">
            <div className="bg-gray-300 h-6 w-4 rounded-sm"></div>
            <p>Dolu</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="bg-amber-300 h-6 w-4 rounded-sm"></div>
            <p>Seçili</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="bg-white border-gray-500 border h-6 w-4 rounded-sm"></div>
            <p>Boş</p>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="w-full max-w-3xl flex-1 mx-4">
          <div>
            <div
              className="flex items-center justify-between p-4  bg-gray-300 mb-2 cursor-pointer"
              onClick={() => setIsOpen(1)}
            >
              <p>1. Yolcu</p>
              {isOpen === 1 ? downIcon : rightIcon}
            </div>
            {isOpen === 1 && form(1)}
          </div>
          <div>
            <div
              className="flex items-center justify-between p-4  bg-gray-300 mb-2 cursor-pointer"
              onClick={() => setIsOpen(2)}
            >
              <p>2. Yolcu</p>
              {isOpen === 2 ? downIcon : rightIcon}
            </div>
            {isOpen === 2 && form(2)}
          </div>
          <div
            className="flex items-center justify-between p-4  bg-gray-300 mb-2 cursor-pointer"
            onClick={() => setIsOpen(3)}
          >
            <div>3. Yolcu</div>
            {isOpen === 3 ? downIcon : rightIcon}
          </div>
          {isOpen === 3 && form(3)}
        </div>

        <div
          className="p-4  bg-gray-300 mb-4 cursor-pointer mt-8 mx-4"
          onClick={save}
        >
          <p className="text-center">İşlemleri Tamamla</p>
        </div>

        <div className="p-4  bg-gray-300 mb-4 mt-8 flex justify-between">
          <div className="flex gap-4">
            {selectedSeats.map((seat) => (
              <div
                key={seat.order}
                className="bg-amber-300 rounded-sm p-2 text-sm"
              >
                {seat.order}
              </div>
            ))}
          </div>
          <div>
            <div>
              <div className="flex gap-2 items-end justify-end">
                <p className="text-sm">{selectedSeats.length} x</p>
                <div className="bg-amber-300 h-6 w-4 rounded-sm"></div>
              </div>
              <p className="text-lg text-right">{totalPrice}TL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
