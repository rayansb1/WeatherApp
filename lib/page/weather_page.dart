import 'package:flutter/material.dart';
import 'package:weatherapi/model/weather_model.dart';
import 'package:weatherapi/service/weather_service.dart';

class WeatherPage extends StatefulWidget {
  const WeatherPage({super.key});

  @override
  State<WeatherPage> createState() => WeatherPageState();
}

class WeatherPageState extends State<WeatherPage> {
  // API key
  final _weatherService = WeatherService('1032d5bf6959b673cb7ba789aa37f83d');
  Weather? _weather;

  // Fetch weather
  _fetchWeather() async {
    // Get the current city
    String cityName = await _weatherService.getCurrentCity();
    // Get weather for city
    try {
      final weather = await _weatherService.getWeather(cityName);
      setState(() {
        _weather = weather;
      });
    } catch (e) {
      print(e);
    }
  }

  // Override initState method to fetch weather on startup
  @override
  void initState() {
    super.initState();
    _fetchWeather();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(_weather?.cityName ?? "loading city.."),
        ],
      ),
    ));
  }
}
