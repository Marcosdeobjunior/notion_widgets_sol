import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const booksMock = [
  {
    id: 1,
    title: "O Senhor dos Anéis",
    image: "https://via.placeholder.com/100",
    status: "Lido",
    rating: 5,
    genre: "Fantasia",
    link: "#"
  },
  {
    id: 2,
    title: "1984",
    image: "https://via.placeholder.com/100",
    status: "A ler",
    rating: 4,
    genre: "Ficção",
    link: "#"
  }
  // Adicione mais livros conforme necessário
];

const statuses = ["Todos", "Favoritos", "A ler", "Quero Ler", "Lido", "Gêneros"];

const BookCard = ({ book }) => {
  return (
    <Card className="rounded-2xl shadow-md overflow-hidden flex flex-col">
      <img src={book.image} alt={book.title} className="h-40 w-full object-cover" />
      <CardContent className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg mb-1">{book.title}</h3>
          <p className="text-sm text-muted-foreground mb-2">Status: {book.status}</p>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < book.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill={i < book.rating ? 'currentColor' : 'none'} />
            ))}
          </div>
          <Badge>{book.genre}</Badge>
        </div>
        <Button className="mt-4 w-full" variant="outline" asChild>
          <a href={book.link} target="_blank">Ver Livro</a>
        </Button>
      </CardContent>
    </Card>
  );
};

const GenreSummary = ({ books, genreFilter, setGenreFilter, genres, setGenres }) => {
  const genreCounts = books.reduce((acc, b) => {
    acc[b.genre] = (acc[b.genre] || 0) + 1;
    return acc;
  }, {});

  const [newGenre, setNewGenre] = useState("");

  const addGenre = () => {
    if (newGenre && !genres.includes(newGenre)) {
      const updated = [...genres, newGenre];
      setGenres(updated);
      localStorage.setItem("genres", JSON.stringify(updated));
      setNewGenre("");
    }
  };

  const removeGenre = (genreToRemove) => {
    const updated = genres.filter(g => g !== genreToRemove);
    setGenres(updated);
    localStorage.setItem("genres", JSON.stringify(updated));
  };

  return (
    <div className="mt-6">
      <div className="flex gap-2 mb-2">
        <Input
          value={newGenre}
          onChange={(e) => setNewGenre(e.target.value)}
          placeholder="Novo gênero"
          className="w-1/3"
        />
        <Button onClick={addGenre}>Adicionar</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <div key={genre} className="flex items-center gap-1">
            <Badge
              className="cursor-pointer"
              onClick={() => setGenreFilter(genre)}
            >
              {genre} ({genreCounts[genre] || 0})
            </Badge>
            <X className="w-3 h-3 cursor-pointer text-red-500" onClick={() => removeGenre(genre)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function BookListWidget() {
  const [tab, setTab] = useState("Todos");
  const [genreFilter, setGenreFilter] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const [genres, setGenres] = useState(() => {
    const stored = localStorage.getItem("genres");
    return stored ? JSON.parse(stored) : [...new Set(booksMock.map(b => b.genre))];
  });

  const filteredBooks = booksMock.filter(book => {
    if (genreFilter && book.genre !== genreFilter) return false;
    if (tab === "Todos") return true;
    if (tab === "Favoritos") return book.rating >= 4;
    return book.status === tab;
  });

  const pageCount = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statusCounts = {
    "Lido": booksMock.filter(b => b.status === "Lido").length,
    "A ler": booksMock.filter(b => b.status === "A ler").length,
    "Quero Ler": booksMock.filter(b => b.status === "Quero Ler").length,
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [tab, genreFilter]);

  return (
    <div className="p-6 grid grid-cols-12 gap-6">
      <div className="col-span-2 space-y-6">
        <div className="text-xl font-bold">Meta do Ano: 30 livros</div>
        {Object.entries(statusCounts).map(([key, count]) => (
          <div key={key} className="flex justify-between">
            <span>{key}</span>
            <span>{count}</span>
          </div>
        ))}
      </div>

      <div className="col-span-10">
        <Tabs value={tab} onValueChange={setTab} className="mb-4">
          <TabsList>
            {statuses.map(status => (
              <TabsTrigger key={status} value={status}>{status}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-4 gap-4">
          {paginatedBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Anterior</Button>
          <span>Página {currentPage} de {pageCount}</span>
          <Button disabled={currentPage === pageCount} onClick={() => setCurrentPage(p => p + 1)}>Próxima</Button>
        </div>

        <GenreSummary books={booksMock} genreFilter={genreFilter} setGenreFilter={setGenreFilter} genres={genres} setGenres={setGenres} />
      </div>
    </div>
  );
}
