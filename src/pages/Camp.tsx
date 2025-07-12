
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Clock, Users, Camera, TreePine } from "lucide-react";

const Camp = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Лагерь Eden Complex
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Уникальное место для творчества, отдыха и вдохновения. 
              Погрузитесь в атмосферу природы и искусства в нашем современном лагере.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-primary" />
                  Творческие мастерские
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Профессиональные студии для рисования, анимации и создания комиксов. 
                  Все необходимое оборудование и материалы включены.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-primary" />
                  Природная локация
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Живописное место у озера в экологически чистой зоне. 
                  Свежий воздух и красивые пейзажи для максимального вдохновения.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Сообщество
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Встречайтесь с единомышленниками, обменивайтесь опытом 
                  и создавайте совместные проекты в дружественной атмосфере.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Map Section */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                Местоположение
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  <strong>Адрес:</strong> ул. Исааакиевское Озеро, 1, Орехово-Зуево, Московская область, 142608
                </p>
                
                {/* Yandex Map */}
                <div className="w-full h-96 rounded-lg overflow-hidden border">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?um=constructor%3A84e8c2c8f7b5d4c5a5b4d4c5a5b4d4c5&amp;&amp;source=constructor"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    allowFullScreen
                    aria-hidden="false"
                    tabIndex={0}
                    title="Eden Complex на карте"
                  />
                </div>
                
                {/* Contact Info */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Телефон</p>
                      <p className="text-muted-foreground">+7 (123) 456-78-90</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Режим работы</p>
                      <p className="text-muted-foreground">Круглосуточно</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>О лагере</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none text-muted-foreground">
                <p>
                  Eden Complex — это больше чем просто лагерь. Это творческое пространство, 
                  где художники, аниматоры и создатели комиксов могут полностью погрузиться 
                  в свое искусство, не отвлекаясь на повседневные заботы.
                </p>
                <p>
                  Наш лагерь расположен в живописном месте у Исаакиевского озера, 
                  в окружении леса и природы. Здесь вы найдете все необходимое для комфортного 
                  проживания и продуктивной работы: современные студии, профессиональное 
                  оборудование, уютные жилые помещения и зоны отдыха.
                </p>
                <p>
                  Мы организуем мастер-классы, воркшопы и творческие встречи, 
                  где участники могут учиться друг у друга, делиться опытом и создавать 
                  совместные проекты. Eden Complex — это место, где рождаются идеи 
                  и воплощаются мечты.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Camp;
