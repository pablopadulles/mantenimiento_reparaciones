from flask import Flask, render_template, Response, jsonify, request
# ~ from camera import VideoCamera
from flask_tryton import Tryton
import os
import configparser

app = Flask(__name__)
configfile = os.environ.get('FLASK_CONFIG')


if configfile:
    config = configparser.ConfigParser()
    config.read(configfile)
    app.config['TRYTON_DATABASE'] = config.get('tryton', 'db')
    app.config['TRYTON_CONFIG'] = config.get('tryton', 'trytond-conf')
else:
    app.config['TRYTON_DATABASE'] = 'alpi52'
    app.config['TRYTON_CONFIG'] = '/home/pablo/fuentes/tryton/5.2/trytond.conf'

tryton = Tryton(app)
User = tryton.pool.get('res.user')
Party = tryton.pool.get('party.party')
Departamento = tryton.pool.get('alpi.departamento')

video_camera = None
global_frame = None

@tryton.default_context
def default_context():
    return User.get_preferences(context_only=True)

@app.route('/')
@tryton.transaction()
def index():
    departamentos = Departamento.search([])
    d = [d.name for d in departamentos]

    return render_template('index.html', ejemplo=sorted(d, key=str.lower))

@app.route('/crear_incidenacia', methods=['POST'])
@tryton.transaction()
def crear_incidenacia():
    json = request.get_json()
    resolucion = None

    if json.get('resolucion') == "Lo antes Posible":
        resolucion = 'lap'
    else:
        resolucion = 'urgente'

    Mantenimiento = tryton.pool.get('alpi.incidencias.mantenimiento')
    departamento, = Departamento.search([('name', '=', json.get('sector'))])
    validate = Mantenimiento.create([{
        'name': departamento.id,
        'nombre': json.get('nombre'),
        'tel': json.get('telefono'),
        'resolucion': resolucion,
        'motivo': json.get('motivo'),
        'state': 'new',
        'email': json.get('email'),
    }])

    if validate:
        # ~ print(personal[0].__dict__)
        return jsonify(
            resultado=True,
            )
    else:
        return jsonify(
            resultado=False,
            )


    #~ status = json['status']

    #~ if status == "true":
        #~ video_camera.start_record()
        #~ return jsonify(result="started")
    #~ else:
        #~ video_camera.stop_record()

#~ def video_stream():
    #~ global video_camera
    #~ global global_frame

    #~ if video_camera == None:
        #~ video_camera = VideoCamera()

    #~ while True:
        #~ frame = video_camera.get_frame()

        #~ if frame != None:
            #~ global_frame = frame
            #~ yield (b'--frame\r\n'
                    #~ b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')
        #~ else:
            #~ yield (b'--frame\r\n'
                            #~ b'Content-Type: image/jpeg\r\n\r\n' + global_frame + b'\r\n\r\n')

#~ def picture():
    #~ yield (b'--frame\r\n'
                    #~ b'Content-Type: image/png\r\n\r\n static/logo.png \r\n\r\n')

#~ @app.route('/video_viewer')
#~ def video_viewer():
    #~ return Response(video_stream(),
                    #~ mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == '__main__':

    app.run(host='0.0.0.0', threaded=True)
